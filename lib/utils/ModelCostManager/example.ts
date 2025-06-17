// usage-example.ts - Example of using the daily token bucket system

import ModelCostManager from ".";

// Create the model cost manager
const costManager = new ModelCostManager({
	dailyTokenAllocation: 100000, // 100K tokens per day for regular users
	premiumUserAllocations: {
		"premium-user-1": 250000, // Premium users get more tokens
		"premium-user-2": 500000,
	},
	resetHourUTC: 0, // Reset at midnight UTC
});

// Register models with their costs
costManager.registerModels([
	{
		id: "llama-3.1-8b-instant",
		name: "Llama 3.1 8B Instant",
		inputTokenCost: 0.15, // $0.15 per 1K tokens, converted to token count
		outputTokenCost: 0.2, // $0.20 per 1K tokens, converted to token count
		contextWindow: 8192,
		features: ["NLP", "TG", "T2TG", "QA", "TC", "SS"],
	},
	{
		id: "llama3-70b-8192",
		name: "Llama 3 70B",
		inputTokenCost: 0.6, // $0.60 per 1K tokens, converted to token count
		outputTokenCost: 0.9, // $0.90 per 1K tokens, converted to token count
		contextWindow: 8192,
		features: ["NLP", "TG", "T2TG", "QA", "SUM", "FE", "ZSC", "TC"],
	},
	{
		id: "mistral-saba-24b",
		name: "Mistral Saba 24B",
		inputTokenCost: 0.3, // $0.30 per 1K tokens, converted to token count
		outputTokenCost: 0.6, // $0.60 per 1K tokens, converted to token count
		contextWindow: 32768,
		features: ["NLP", "TG", "T2TG", "QA", "SUM", "TC", "FE"],
	},
]);

// Example function to handle user requests
async function handleUserRequest(
	userId: string,
	prompt: string,
	requiredFeatures: string[] = ["NLP", "TG"]
): Promise<string> {
	try {
		// Get user's current balance
		const balance = costManager.getUserBalance(userId);
		console.log(
			`User ${userId} has ${balance.remainingTokens} tokens remaining (${balance.percentRemaining}%)`
		);

		// Estimate tokens for this request
		const inputTokens = costManager.estimateTokenCount(prompt);
		const estimatedOutputTokens = Math.ceil(inputTokens * 1.5); // Estimate output as 1.5x input

		// Find an affordable model that meets the requirements
		const affordableModel = costManager.findAffordableModel(
			userId,
			requiredFeatures,
			inputTokens,
			estimatedOutputTokens
		);

		if (!affordableModel) {
			// Calculate time until refill
			const refillTime = new Date(Date.now() + balance.timeUntilRefillMs);

			return `You don't have enough tokens for this request. Your tokens will reset at ${refillTime.toLocaleTimeString()} (in ${Math.ceil(
				balance.timeUntilRefillMs / (1000 * 60)
			)} minutes).`;
		}

		console.log(
			`Using model ${affordableModel.modelId} with estimated cost of ${affordableModel.estimatedCost} tokens`
		);

		// Reserve tokens for this request
		const usage = costManager.canUseModel(
			userId,
			affordableModel.modelId,
			inputTokens,
			estimatedOutputTokens
		);

		if (!usage.allowed) {
			return `Unexpected error: Could not allocate tokens for the request.`;
		}

		// Make the actual API call (simulated here)
		const result = await simulateModelCall(affordableModel.modelId, prompt);

		// Record actual token usage and get any refund
		const refund = costManager.recordActualUsage(
			userId,
			affordableModel.modelId,
			result.usage.prompt_tokens,
			result.usage.completion_tokens,
			inputTokens,
			estimatedOutputTokens
		);

		if (refund > 0) {
			console.log(`Refunded ${refund} tokens to user ${userId}`);
		}

		// Get updated balance
		const updatedBalance = costManager.getUserBalance(userId);

		return `${result.output}\n\nYou have ${updatedBalance.remainingTokens} tokens remaining today.`;
	} catch (error) {
		console.error(`Error processing request:`, error);
		return `An error occurred while processing your request.`;
	}
}

// Simulate an API call
async function simulateModelCall(modelId: string, prompt: string) {
	return new Promise<{
		model: string;
		output: string;
		usage: {
			prompt_tokens: number;
			completion_tokens: number;
			total_tokens: number;
		};
	}>((resolve) => {
		// In a real implementation, this would be an API call
		setTimeout(() => {
			// Simulate slightly lower actual token usage for realistic refunds
			const promptTokens = Math.ceil(prompt.length / 4);
			const completionTokens = Math.ceil(promptTokens * 1.2); // Simulate less output than estimated

			resolve({
				model: modelId,
				output: `This is a simulated response from model ${modelId}. Your request was processed successfully.`,
				usage: {
					prompt_tokens: promptTokens,
					completion_tokens: completionTokens,
					total_tokens: promptTokens + completionTokens,
				},
			});
		}, 500);
	});
}

// Example usage
async function runExample() {
	// Regular user example
	const regularUserId = "user-123";

	console.log("==== Regular User Example ====");

	// First request - simple question
	let response1 = await handleUserRequest(
		regularUserId,
		"What is the capital of France?",
		["NLP", "QA"]
	);
	console.log("\nResponse 1:", response1);
	console.log("\nUser stats:", costManager.getUserUsageStats(regularUserId));

	// Second request - larger summarization task
	const largeText =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(50);
	let response2 = await handleUserRequest(
		regularUserId,
		`Summarize the following text: ${largeText}`,
		["NLP", "SUM"]
	);
	console.log("\nResponse 2:", response2);

	// Premium user example
	const premiumUserId = "premium-user-1";

	console.log("\n\n==== Premium User Example ====");

	// Premium user with large request
	const veryLargeText =
		"Lorem ipsum dolor sit amet, consectetur adipiscing elit. ".repeat(200);
	let premiumResponse = await handleUserRequest(
		premiumUserId,
		`Analyze the following text in detail: ${veryLargeText}`,
		["NLP", "SUM", "FE"]
	);
	console.log("\nPremium Response:", premiumResponse);
	console.log(
		"\nPremium user stats:",
		costManager.getUserUsageStats(premiumUserId)
	);

	// Simulate buying more tokens
	console.log("\n\n==== Token Purchase Example ====");
	console.log("User buying 50,000 additional tokens");
	costManager.addUserTokens(regularUserId, 50000);

	// Check updated balance
	const updatedBalance = costManager.getUserBalance(regularUserId);
	console.log(
		`Updated balance: ${updatedBalance.remainingTokens} tokens (${updatedBalance.percentRemaining}%)`
	);
}

// Run the example
runExample().catch(console.error);
