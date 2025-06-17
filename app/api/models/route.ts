import { NextRequest, NextResponse } from "next/server";

import { cache } from "react";

import { convert } from "@/models";

import type {
	Anthropic,
	Cohere,
	Deepinfra,
	Fireworks,
	Gemini,
	Groq,
	Huggingface,
	Mistral,
	Model,
	Openai,
	ProviderResponse,
	SupportedModel,
	Together,
} from "@/models";

abstract class ModelAPI<T extends SupportedModel = SupportedModel> {
	abstract endpoint: string;
	abstract apiKey?: string;
	abstract auth?: {
		type: string;
		format: string;
	} | null;
	abstract requiresAuth: boolean;
	headers?: { [x: string]: string } | null = {};
	query?: { [x: string]: string } | null = {};

	async listModels() {
		const headers = new Headers(this.headers || {});
		const params = new URLSearchParams(this.query || {});
		const url = new URL(this.endpoint);

		if (this.requiresAuth) {
			if (!(this.auth && this.apiKey)) throw new Error(`Missing auth for ${Object}`);
			switch (this.auth.type) {
				case "bearer":
					headers.append("authorization", `Bearer ${this.apiKey}`);
					break;
				case "header":
					const [key, value] = this.auth.format
						.replace("{apiKey}", this.apiKey)
						.split(":");

					headers.append(key, value);

					break;
				case "query":
					const [query, param] = this.auth.format
						.replace("{apiKey}", this.apiKey)
						.split("=");
					url.searchParams.append(query, param);
					break;
				default:
					throw new Error(`Unsupported auth type: ${this.auth.type}`);
			}
		}

		for (const [key, value] of params.entries()) {
			url.searchParams.append(key, value);
		}

		return fetch(url, {
			headers,
		})
			.then((res) => res.json() as Promise<ProviderResponse<T>>)
			.then((json) => {
				if (this.extract) return this.extract(json);
				return json as T[];
			})
			.then(this.convert);
	}
	abstract extract(json: ProviderResponse<T>): T[];
	abstract convert(output: T[]): Model[];
}

class HuggingFaceAPI extends ModelAPI<Huggingface> {
	endpoint = "https://huggingface.co/api/models";
	apiKey?: string = process.env.HUGGINGFACE_API_KEY;
	requiresAuth = false; // Optional for rate limiting
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};
	convert(output: Huggingface[]) {
		return convert(
			output,
			{
				id: "id",
				createdAt: "created_at",
				pipeline_tag: "type",
			},
			["downloads", "library_name", "likes", "private", "tags", "trendingScore"]
		);
	}
	extract(output: ProviderResponse<Huggingface>) {
		return output as Huggingface[];
	}
}

class GroqAPI extends ModelAPI<Groq> {
	endpoint = "https://api.groq.com/openai/v1/models";
	apiKey?: string = process.env.GROQ_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};
	convert(output: Groq[]) {
		return convert(
			output,
			{
				id: "id",
				created: "created_at",
				context_window: "context_size",
				owned_by: "owned_by",
			},
			["active", "max_completion_tokens", "object", "public_apps"]
		);
	}
	extract = (output: ProviderResponse<Groq>) => {
		return output.data;
	};
}

class GeminiAPI extends ModelAPI<Gemini> {
	endpoint = "https://generativelanguage.googleapis.com/v1beta/models";
	apiKey? = process.env.GEMINI_API_KEY;
	requiresAuth = true;
	auth = {
		type: "query",
		format: "key={apiKey}",
	};
	convert(output: Gemini[]) {
		return convert(
			output,
			{
				description: "description",
				name: "id",
				displayName: "name",
			},
			[
				"inputTokenLimit",
				"maxTemperature",
				"outputTokenLimit",
				"supportedGenerationMethods",
				"temperature",
				"topK",
				"topP",
				"version",
			]
		);
	}
	extract(output: ProviderResponse<Gemini>) {
		return output.models;
	}
}

class OpenAIAPI extends ModelAPI<Openai> {
	endpoint = "https://api.openai.com/v1/models";
	apiKey? = process.env.OPENAI_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};
	convert(output: Openai[]) {
		return convert(
			output,
			{
				created: "created_at",
				id: "id",
				owned_by: "owned_by",
			},
			["object"]
		);
	}
	extract(output: ProviderResponse<Openai>) {
		return output.data;
	}
}

class AnthropicAPI extends ModelAPI<Anthropic> {
	endpoint = "https://api.anthropic.com/v1/models";
	apiKey? = process.env.ANTHROPIC_API_KEY;
	requiresAuth = true;
	query = {
		limit: "1000",
	};
	auth = {
		type: "header",
		format: "x-api-key:{apiKey}",
	};
	headers = {
		"anthropic-version": process.env.ANTHROPIC_API_VERSION!,
	};
	convert(output: Anthropic[]) {
		return convert(output, {
			id: "id",
			created_at: "created_at",
			type: "type",
			display_name: "name",
		});
	}
	extract(output: ProviderResponse<Anthropic>) {
		return output.data;
	}
}

class CohereAPI extends ModelAPI<Cohere> {
	endpoint = "https://api.cohere.ai/v1/models";
	apiKey? = process.env.COHERE_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};

	convert(output: Cohere[]) {
		return convert(
			output,
			{
				context_length: "context_size",
				name: "id",
			},
			["finetuned", "features", "supports_vision"]
		);
	}
	extract(output: ProviderResponse<Cohere>) {
		return output.models;
	}
}

class MistralAPI extends ModelAPI<Mistral> {
	endpoint = "https://api.mistral.ai/v1/models";
	apiKey? = process.env.MISTRAL_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};

	convert(output: Mistral[]) {
		return convert(
			output,
			{
				created: "created_at",
				description: "description",
				id: "id",
				max_context_length: "context_size",
				name: "name",
				type: "type",
				owned_by: "owned_by",
			},
			["aliases", "capabilities", "default_model_temperature", "deprecation", "object"]
		);
	}
	extract(output: ProviderResponse<Mistral>) {
		return output.data;
	}
}

class TogetherAPI extends ModelAPI<Together> {
	endpoint = "https://api.together.xyz/v1/models";
	apiKey? = process.env.TOGETHER_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};

	convert(output: Together[]) {
		return convert(
			output,
			{
				created: "created_at",
				context_length: "context_size",
				display_name: "name",
				id: "id",
				organization: "owned_by",
				type: "type",
			},
			["config", "license", "link", "pricing"]
		);
	}
	extract(output: ProviderResponse<Together>) {
		return output as Together[];
	}
}

class DeepInfraAPI extends ModelAPI<Deepinfra> {
	endpoint = "https://api.deepinfra.com/v1/openai/models";
	apiKey? = process.env.DEEPINFRA_API_KEY;
	requiresAuth = false; // Optional for rate limiting
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};

	convert(output: Deepinfra[]) {
		return convert(
			output,
			{
				id: "id",
				created: "created_at",
				owned_by: "owned_by",
			},
			["parent", "object", "root"]
		);
	}
	extract(output: ProviderResponse<Deepinfra>) {
		return output.data;
	}
}

class FireworksAPI extends ModelAPI<Fireworks> {
	endpoint = "https://api.fireworks.ai/inference/v1/models";
	apiKey? = process.env.FIREWORKS_API_KEY;
	requiresAuth = true;
	auth = {
		type: "bearer",
		format: "Bearer {apiKey}",
	};

	convert(output: Fireworks[]) {
		return convert(
			output,
			{
				id: "id",
				kind: "type",
				created: "created_at",
				context_length: "context_size",
				owned_by: "owned_by",
			},
			["supports_chat", "supports_image_input", "supports_tools"]
		);
	}
	extract(output: ProviderResponse<Fireworks>) {
		return output.data;
	}
}

class ModelProviderFactory {
	private static providers = new Map<string, ModelAPI>([
		["huggingface", new HuggingFaceAPI()],
		["groq", new GroqAPI()],
		["gemini", new GeminiAPI()],
		["openai", new OpenAIAPI()],
		["anthropic", new AnthropicAPI()],
		["cohere", new CohereAPI()],
		["mistral", new MistralAPI()],
		["together", new TogetherAPI()],
		["deepinfra", new DeepInfraAPI()],
		["fireworks", new FireworksAPI()],
	]);

	static getProvider(name: string): ModelAPI | undefined {
		return this.providers.get(name.toLowerCase());
	}

	static getAllProviders(): ModelAPI[] {
		return Array.from(this.providers.values());
	}

	static getAvailableProviders(): string[] {
		return Array.from(this.providers.keys());
	}

	static getProvidersWithAuth(): ModelAPI[] {
		return Array.from(this.providers.values()).filter((p) => p.requiresAuth);
	}

	static getProvidersWithoutAuth(): ModelAPI[] {
		return Array.from(this.providers.values()).filter((p) => !p.requiresAuth);
	}
}

async function _fetchAllModels() {
	const promises = new Set<Promise<Model[]>>();
	for (const provider of ModelProviderFactory.getAllProviders()) {
		promises.add(provider.listModels());
	}
	return Promise.all(Array.from(promises));
}

const fetchAllModels = cache(_fetchAllModels);

export async function GET(req: NextRequest) {
	return NextResponse.json((await fetchAllModels()).flat(), {
		status: 200,
	});
}
