// ModelCostManager.ts - Managing model-specific costs with the daily token bucket

import TokenBucket from "./TokenBucket";

/**
 * Model information interface
 */
interface ModelInfo {
	id: string;
	name: string;
	inputTokenCost: number; // Cost per 1K input tokens
	outputTokenCost: number; // Cost per 1K output tokens
	contextWindow: number;
	features: string[];
}

/**
 * Model cost manager configuration
 */
interface ModelCostManagerConfig {
	/** Daily token allocation for users */
	dailyTokenAllocation: number;

	/** Optional premium user allocations */
	premiumUserAllocations?: Record<string, number>;

	/** Reset hour in UTC (defaults to midnight) */
	resetHourUTC?: number;
}

/**
 * Result of a model usage check
 */
interface ModelUsageCheckResult {
	allowed: boolean;
	remainingTokens: number;
	estimatedCost: number;
	timeUntilRefillMs?: number;
}

/**
 * Manager for model costs using the daily token bucket
 */
export default class ModelCostManager {
	private tokenBucket: TokenBucket;
	private models: Map<string, ModelInfo> = new Map();

	/**
	 * Create a new model cost manager
	 */
	constructor(config: ModelCostManagerConfig) {
		this.tokenBucket = new TokenBucket({
			dailyTokenAllocation: config.dailyTokenAllocation,
			resetHourUTC: config.resetHourUTC,
			userBonusTokens: config.premiumUserAllocations,
		});
	}

	/**
	 * Register a model with its cost information
	 */
	public registerModel(model: ModelInfo): void {
		this.models.set(model.id, model);
	}

	/**
	 * Register multiple models at once
	 */
	public registerModels(models: ModelInfo[]): void {
		for (const model of models) {
			this.registerModel(model);
		}
	}

	/**
	 * Check if a user can use a specific model with the given token counts
	 */
	public canUseModel(
		userId: string,
		modelId: string,
		inputTokens: number,
		estimatedOutputTokens: number
	): ModelUsageCheckResult {
		const model = this.models.get(modelId);
		if (!model) {
			throw new Error(`Model ${modelId} not registered`);
		}

		// Calculate total token cost (converted to actual tokens)
		const totalCost = this.calculateTokenCost(
			model,
			inputTokens,
			estimatedOutputTokens
		);

		// Check if user has enough tokens
		const result = this.tokenBucket.requestTokens(
			userId,
			totalCost,
			modelId
		);

		if (!result.allowed) {
			return {
				allowed: false,
				remainingTokens: result.remainingTokens,
				estimatedCost: totalCost,
				timeUntilRefillMs: result.timeUntilRefillMs,
			};
		}

		// Tokens have already been deducted if allowed
		return {
			allowed: true,
			remainingTokens: result.remainingTokens,
			estimatedCost: totalCost,
		};
	}

	/**
	 * Record actual usage after a model call is complete
	 * @returns Any refund of tokens if the actual usage was less than estimated
	 */
	public recordActualUsage(
		userId: string,
		modelId: string,
		actualInputTokens: number,
		actualOutputTokens: number,
		estimatedInputTokens: number,
		estimatedOutputTokens: number
	): number {
		const model = this.models.get(modelId);
		if (!model) {
			throw new Error(`Model ${modelId} not registered`);
		}

		// Calculate actual cost
		const actualCost = this.calculateTokenCost(
			model,
			actualInputTokens,
			actualOutputTokens
		);

		// Calculate estimated cost that was already deducted
		const estimatedCost = this.calculateTokenCost(
			model,
			estimatedInputTokens,
			estimatedOutputTokens
		);

		// If we overestimated, refund the difference
		if (estimatedCost > actualCost) {
			const refund = estimatedCost - actualCost;
			this.tokenBucket.addBonusTokens(userId, refund);
			return refund;
		}

		return 0;
	}

	/**
	 * Find the most appropriate model that the user can afford
	 */
	public findAffordableModel(
		userId: string,
		requiredFeatures: string[],
		inputTokens: number,
		estimatedOutputTokens: number
	):
		| {
				modelId: string;
				remainingTokens: number;
				estimatedCost: number;
		  }
		| undefined {
		const userBalance = this.tokenBucket.getUserBalance(userId);
		let bestModel:
			| {
					modelId: string;
					remainingTokens: number;
					estimatedCost: number;
					costPerToken: number; // For comparison
			  }
			| undefined;

		// Try each model that has the required features
		for (const [modelId, model] of this.models.entries()) {
			// Check if model has all required features
			const hasAllFeatures = requiredFeatures.every((feature) =>
				model.features.includes(feature)
			);

			if (!hasAllFeatures) {
				continue;
			}

			// Calculate estimated cost
			const estimatedCost = this.calculateTokenCost(
				model,
				inputTokens,
				estimatedOutputTokens
			);

			// Check if user can afford this model
			if (estimatedCost > userBalance.remainingTokens) {
				continue;
			}

			// Calculate cost efficiency (cost per token)
			const costPerToken =
				estimatedCost / (inputTokens + estimatedOutputTokens);

			// If this is our first valid model or it's more cost-efficient
			if (!bestModel || costPerToken < bestModel.costPerToken) {
				bestModel = {
					modelId,
					remainingTokens:
						userBalance.remainingTokens - estimatedCost,
					estimatedCost,
					costPerToken,
				};
			}
		}

		if (bestModel) {
			return {
				modelId: bestModel.modelId,
				remainingTokens: bestModel.remainingTokens,
				estimatedCost: bestModel.estimatedCost,
			};
		}

		return undefined;
	}

	/**
	 * Get a user's token balance information
	 */
	public getUserBalance(userId: string) {
		return this.tokenBucket.getUserBalance(userId);
	}

	/**
	 * Get detailed usage statistics for a user
	 */
	public getUserUsageStats(userId: string) {
		return this.tokenBucket.getUserUsageStats(userId);
	}

	/**
	 * Add bonus tokens to a user's allocation
	 */
	public addUserTokens(userId: string, tokens: number): void {
		this.tokenBucket.addBonusTokens(userId, tokens);
	}

	/**
	 * Reset a user's token bucket (for administrative purposes)
	 */
	public resetUserBucket(userId: string): void {
		this.tokenBucket.resetUserBucket(userId);
	}

	/**
	 * Convert cost rates and token counts to actual token cost
	 * Takes into account different rates for input vs output tokens
	 */
	private calculateTokenCost(
		model: ModelInfo,
		inputTokens: number,
		outputTokens: number
	): number {
		// Calculate costs in millitokens (fractional token costs)
		const inputCost = (inputTokens / 1000) * model.inputTokenCost * 1000;
		const outputCost = (outputTokens / 1000) * model.outputTokenCost * 1000;

		// Convert to integer token cost (rounded up)
		return Math.ceil(inputCost + outputCost);
	}

	/**
	 * Estimate token count for text
	 * Note: For production use, replace with proper tokenizer
	 */
	public estimateTokenCount(text: string): number {
		// Simple approximation: ~4 characters per token for English text
		return Math.ceil(text.length / 4);
	}
}
