import _ from "lodash";
import { Primitive } from "type-fest";

export interface ModelList {
	huggingface: Huggingface[];
	groq: GroqResponse;
	gemini: GeminiResponse;
	openai: OpenaiResponse;
	anthropic: AnthropicResponse;
	cohere: CohereResponse;
	mistral: MistralResponse;
	together: Together[];
	deepinfra: DeepinfraResponse;
	fireworks: FireworksResponse;
}

type ResponseType =
	| AnthropicResponse
	| CohereResponse
	| DeepinfraResponse
	| FireworksResponse
	| GeminiResponse
	| GroqResponse
	| MistralResponse
	| OpenaiResponse
	| Together
	| Huggingface;

export type ProviderResponse<T extends SupportedModel = SupportedModel> = T extends Anthropic
	? AnthropicResponse
	: T extends Cohere
	? CohereResponse
	: T extends Deepinfra
	? DeepinfraResponse
	: T extends Fireworks
	? FireworksResponse
	: T extends Gemini
	? GeminiResponse
	: T extends Groq
	? GroqResponse
	: T extends Mistral
	? MistralResponse
	: T extends Openai
	? OpenaiResponse
	: T extends Together
	? Together[]
	: T extends Huggingface
	? Huggingface[]
	: never;

/** Response Types  */
export interface AnthropicResponse {
	data: Anthropic[];
	has_more: boolean;
	first_id: string;
	last_id: string;
}

export interface CohereResponse {
	models: Cohere[];
	next_page_token: string;
}
export interface DeepinfraResponse {
	object: string;
	data: Deepinfra[];
}
export interface FireworksResponse {
	data: Fireworks[];
	object: string;
}
export interface GeminiResponse {
	models: Gemini[];
	nextPageToken: string;
}
export interface GroqResponse {
	object: string;
	data: Groq[];
}

export interface MistralResponse {
	object: string;
	data: Mistral[];
}
export interface OpenaiResponse {
	object: string;
	data: Openai[];
}

/** Helper types */

export enum Object {
	Model = "model",
}

export enum Kind {
	FluminaBaseModel = "FLUMINA_BASE_MODEL",
	HFBaseModel = "HF_BASE_MODEL",
	HFPeftAddon = "HF_PEFT_ADDON",
}

export enum SupportedGenerationMethod {
	BatchGenerateContent = "batchGenerateContent",
	BidiGenerateContent = "bidiGenerateContent",
	CountTextTokens = "countTextTokens",
	CountTokens = "countTokens",
	CreateCachedContent = "createCachedContent",
	EmbedContent = "embedContent",
	EmbedText = "embedText",
	GenerateAnswer = "generateAnswer",
	GenerateContent = "generateContent",
	Predict = "predict",
	PredictLongRunning = "predictLongRunning",
}

export interface Capabilities {
	completion_chat: boolean;
	completion_fim: boolean;
	function_calling: boolean;
	fine_tuning: boolean;
	vision: boolean;
	classification: boolean;
}

export enum FluffyOwnedBy {
	Mistralai = "mistralai",
}

export enum PurpleOwnedBy {
	Deepinfra = "deepinfra",
}

export enum TentacledOwnedBy {
	Openai = "openai",
	OpenaiInternal = "openai-internal",
	System = "system",
}

export enum DatumType {
	Base = "base",
}

export interface Config {
	chat_template: null | string;
	stop: string[];
	bos_token: BosToken | null;
	eos_token: null | string;
	max_output_length?: number;
}

export enum BosToken {
	BeginOfSentence = "<｜begin▁of▁sentence｜>",
	BeginOfText = "<|begin_of_text|>",
	Bos = "<bos>",
	BosTokenBOS = "[BOS]",
	Endoftext = "<|endoftext|>",
	Pad = "[PAD]",
	S = "<s>",
}

export interface Pricing {
	hourly: number;
	input: number;
	output: number;
	base: number;
	finetune: number;
}

export enum TogetherType {
	Audio = "audio",
	Chat = "chat",
	Embedding = "embedding",
	Image = "image",
	Language = "language",
	Moderation = "moderation",
	Rerank = "rerank",
}

/** Models */
export type Model = {
	id: string;
	name?: string;
	owned_by?: string;
	context_size?: number;
	created_at?: number;
	description?: string;
	type?: string;
	features?: {
		[x: string]: Primitive;
	};
};

export type SupportedModel =
	| Anthropic
	| Cohere
	| Deepinfra
	| Fireworks
	| Gemini
	| Groq
	| Huggingface
	| Mistral
	| Openai
	| Together;

type Mapping<T extends SupportedModel = SupportedModel> = {
	[k in keyof T]?: Exclude<keyof Model, "features">;
};

type K = Mapping<Anthropic>;

export function convert<T extends SupportedModel, M extends Mapping<T>>(
	output: T[],
	mapping: M,
	featureFields?: (keyof Omit<T, keyof typeof mapping>)[]
): Model[] {
	//@ts-expect-error
	return _.map(output, (model) =>
		_.merge(
			_.mapKeys(_.pick(model, _.keys(mapping)), (value, key) => {
				return mapping[key as keyof typeof mapping];
			}),
			featureFields
				? {
						features: _.pick(model, featureFields || []),
				  }
				: null
		)
	);
}

export interface Cohere {
	context_length: number; // context_size
	default_endpoints: string[];
	endpoints: string[];
	features: string[] | null; //features
	finetuned: boolean; //features
	name: string; //id
	supports_vision: boolean; //features
	tokenizer_url: null | string;
}

export interface Groq {
	active: boolean;
	context_window: number; // context_size
	created: number; //created_at
	id: string; //id
	max_completion_tokens: number;
	object: Object;
	owned_by: string; //owned_by
	public_apps: null; //features
}

export interface Together {
	config: Config;
	context_length?: number; // context_size
	created: number; //created_at
	display_name: string; // name
	id: string; // id
	license?: null | string;
	link?: null | string;
	object: Object;
	organization?: string; //owned_by
	pricing: Pricing;
	running: boolean;
	type: TogetherType; //type
}

export interface Openai {
	created: number; //created_at
	id: string; //id
	object: Object;
	owned_by: TentacledOwnedBy; //owned_by
}

export interface Mistral {
	aliases: string[];
	capabilities: Capabilities; //features
	created: number; //created_at
	default_model_temperature: number | null; //features
	deprecation: null;
	description: string; // description
	id: string; // id
	max_context_length: number; // context_size
	name: string; // name
	object: Object;
	owned_by: FluffyOwnedBy; //owned_by
	type: DatumType; // type
}
export interface Huggingface {
	_id: string;
	createdAt: Date; //created_at
	downloads: number;
	id: string; // id
	library_name?: string;
	likes: number;
	modelId: string;
	pipeline_tag?: string; //type
	private: boolean;
	tags: string[]; //features?
	trendingScore: number;
}
export interface Gemini {
	description?: string; // description
	displayName: string; // name
	inputTokenLimit: number; // context_size
	maxTemperature?: number;
	name: string; // id
	outputTokenLimit: number;
	supportedGenerationMethods: SupportedGenerationMethod[]; //features
	temperature?: number;
	topK?: number;
	topP?: number;
	version: string;
}

export interface Anthropic {
	created_at: Date; //created_at
	display_name: string; // name
	id: string; //id
	type: Object;
}
export interface Deepinfra {
	created: number; //created_at
	id: string; //id
	object: Object;
	owned_by: PurpleOwnedBy; //owned_by
	parent: null;
	root: string;
}

export interface Fireworks {
	context_length?: number; // context_size
	created: number; //created_at
	id: string; //id
	kind: Kind; //type
	object: Object;
	owned_by: string; //owned_by
	supports_chat: boolean; //features
	supports_image_input: boolean; //features
	supports_tools: boolean; //features
}
