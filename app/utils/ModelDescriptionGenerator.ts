class ModelDescriptionGenerator {
	attributes: {
		adjectives: string[];
		domains: string[];
		types: string[];
		sizes: string[];
		specialties: string[];
	};
	constructor() {
		this.attributes = {
			adjectives: [
				"Swift",
				"Versatile",
				"Precise",
				"Creative",
				"Analytical",
				"Robust",
				"Advanced",
				"Efficient",
				"Intelligent",
				"Sophisticated",
				"Nimble",
				"Powerful",
				"Elegant",
				"Dynamic",
				"Adaptive",
				"Intuitive",
				"Enhanced",
				"Optimized",
				"Innovative",
				"Comprehensive",
				"Streamlined",
				"Professional",
				"Refined",
				"Expert",
			],
			domains: [
				"Reasoning",
				"Language",
				"Vision",
				"Code",
				"Chat",
				"Research",
				"Writing",
				"Analysis",
				"Dialogue",
				"Multimodal",
				"Instruction",
				"Conversational",
				"Technical",
				"Creative",
				"Scientific",
				"Mathematical",
				"Logic",
				"Understanding",
				"Generation",
				"Translation",
				"Summarization",
				"Problem-solving",
				"Knowledge",
				"Learning",
			],
			types: [
				"Assistant",
				"Model",
				"AI",
				"Engine",
				"Bot",
				"Agent",
				"System",
				"Platform",
				"Framework",
				"Interface",
				"Processor",
				"Generator",
				"Analyzer",
				"Interpreter",
				"Companion",
				"Advisor",
				"Helper",
				"Tool",
				"Service",
				"Solution",
				"Application",
				"Intelligence",
				"Network",
				"Core",
			],
			sizes: [
				"Compact",
				"Standard",
				"Large",
				"Massive",
				"Mini",
				"Pro",
				"Ultra",
				"Lite",
				"Max",
				"Plus",
				"Premium",
				"Enterprise",
			],
			specialties: [
				"General",
				"Specialized",
				"Focused",
				"Versatile",
				"Multi-purpose",
				"Targeted",
				"Broad",
				"Niche",
				"Universal",
				"Specific",
				"Comprehensive",
				"Dedicated",
			],
		};
	}

	// Simple hash function for consistent results
	hashString(str: string) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			const char = str.charCodeAt(i);
			hash = (hash << 5) - hash + char;
			hash = hash & hash; // Convert to 32-bit integer
		}
		return Math.abs(hash);
	}

	// Extract characteristics from model ID
	extractCharacteristics(modelId: string) {
		const lowerModelId = modelId.toLowerCase();

		// Size indicators
		let size = "Standard";
		if (/mini|small|7b|3b/i.test(modelId)) size = "Compact";
		else if (/large|70b|65b|175b/i.test(modelId)) size = "Large";
		else if (/xl|ultra|405b|giant/i.test(modelId)) size = "Massive";
		else if (/lite|light/i.test(modelId)) size = "Lite";
		else if (/pro|plus|premium/i.test(modelId)) size = "Pro";

		// Specialty indicators
		let specialty = "General";
		if (/code|programming|dev/i.test(modelId)) specialty = "Code";
		else if (/vision|visual|image/i.test(modelId)) specialty = "Vision";
		else if (/chat|conversation|instruct/i.test(modelId))
			specialty = "Chat";
		else if (/math|reasoning|logic/i.test(modelId)) specialty = "Reasoning";
		else if (/creative|art|writing/i.test(modelId)) specialty = "Creative";

		// Provider indicators
		let provider = "Unknown";
		if (/gpt|openai/i.test(modelId)) provider = "OpenAI";
		else if (/claude|anthropic/i.test(modelId)) provider = "Anthropic";
		else if (/gemini|google|bard/i.test(modelId)) provider = "Google";
		else if (/llama|meta/i.test(modelId)) provider = "Meta";
		else if (/mistral/i.test(modelId)) provider = "Mistral";

		// Version/generation indicators
		let generation = "Current";
		if (/beta|preview|alpha/i.test(modelId)) generation = "Beta";
		else if (/latest|new/i.test(modelId)) generation = "Latest";
		else if (/legacy|old/i.test(modelId)) generation = "Legacy";
		else if (/turbo|fast/i.test(modelId)) generation = "Turbo";

		return { size, specialty, provider, generation };
	}

	// Generate unique description using hybrid approach
	generateDescription(modelId: string) {
		const hash = this.hashString(modelId);
		const characteristics = this.extractCharacteristics(modelId);

		// Multiple templates for variety
		const templates = [
			// Adjective + Domain + Type
			() => {
				const adj =
					this.attributes.adjectives[
						hash % this.attributes.adjectives.length
					];
				const domain =
					this.attributes.domains[
						(hash >> 8) % this.attributes.domains.length
					];
				const type =
					this.attributes.types[
						(hash >> 16) % this.attributes.types.length
					];
				return `${adj} ${domain} ${type}`;
			},

			// Size + Specialty + Type
			() => {
				const specialty =
					this.attributes.specialties[
						hash % this.attributes.specialties.length
					];
				const type =
					this.attributes.types[
						(hash >> 8) % this.attributes.types.length
					];
				return `${characteristics.size} ${specialty} ${type}`;
			},

			// Provider + Generation + Domain
			() => {
				const domain =
					this.attributes.domains[
						hash % this.attributes.domains.length
					];
				return `${characteristics.provider} ${characteristics.generation} ${domain}`;
			},

			// Adjective + Size + Assistant
			() => {
				const adj =
					this.attributes.adjectives[
						(hash >> 4) % this.attributes.adjectives.length
					];
				return `${adj} ${characteristics.size} Assistant`;
			},

			// Specialty-focused + Type
			() => {
				const type =
					this.attributes.types[hash % this.attributes.types.length];
				return `${characteristics.specialty}-focused ${type}`;
			},
		];

		// Use hash to consistently select template
		const templateIndex = (hash >> 24) % templates.length;
		return templates[templateIndex]();
	}

	// Generate multiple descriptions for testing uniqueness
	generateBatch(modelIds: string[]) {
		const descriptions = new Map();
		const duplicates = [] as {
			modelId: string;
			description: string;
			duplicate: string;
		}[];

		modelIds.forEach((modelId) => {
			const description = this.generateDescription(modelId);
			if (descriptions.has(description)) {
				duplicates.push({
					modelId,
					description,
					duplicate: descriptions.get(description),
				});
			} else {
				descriptions.set(description, modelId);
			}
		});

		return {
			descriptions: Array.from(descriptions.entries()).map(
				([desc, id]) => ({ modelId: id, description: desc })
			),
			duplicates,
			uniquenessRate: (
				(descriptions.size / modelIds.length) *
				100
			).toFixed(1),
		};
	}
}

// Example usage
const generator = new ModelDescriptionGenerator();
Object.assign(generator, {
	runTest: () => runTest(),
});
function runTest() {
	// Test with various model IDs
	const testModels = [
		"gpt-4-turbo",
		"gpt-3.5-turbo",
		"claude-3-opus",
		"claude-3-sonnet",
		"claude-3-haiku",
		"gemini-pro",
		"gemini-pro-vision",
		"llama-2-70b-chat",
		"llama-2-7b-chat",
		"mistral-7b-instruct",
		"codellama-34b-instruct",
		"gpt-4-vision-preview",
		"claude-instant-1",
		"palm-2-chat-bison",
		"cohere-command-xlarge",
		"anthropic-claude-v1",
		"openai-gpt-4-32k",
		"google-flan-t5-xxl",
		"meta-llama-65b",
		"mistral-medium",
	];

	console.log("=== Model Description Examples ===");
	testModels.forEach((modelId) => {
		const description = generator.generateDescription(modelId);
		console.log(`${modelId} -> "${description}"`);
	});

	console.log("\n=== Batch Analysis ===");
	const batchResult = generator.generateBatch(testModels);
	console.log(`Uniqueness Rate: ${batchResult.uniquenessRate}%`);
	console.log(`Total Models: ${testModels.length}`);
	console.log(`Unique Descriptions: ${batchResult.descriptions.length}`);
	console.log(`Duplicates: ${batchResult.duplicates.length}`);

	if (batchResult.duplicates.length > 0) {
		console.log("\nDuplicate Descriptions:");
		batchResult.duplicates.forEach((dup) => {
			console.log(
				`"${dup.description}" -> ${dup.modelId} (same as ${dup.duplicate})`
			);
		});
	}
}

export default generator;
