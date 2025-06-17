// DailyTokenBucket.ts - A daily token allocation system with leaky bucket approach

/**
 * Configuration for the token bucket
 */
interface TokenBucketConfig {
	/** Daily token allocation per user */
	dailyTokenAllocation: number;

	/** When to reset the token bucket (defaults to midnight UTC) */
	resetHourUTC?: number;

	/** Extra tokens that can be added to specific users */
	userBonusTokens?: Record<string, number>;

	/** Optional callback when a user runs out of tokens */
	onTokensExhausted?: (userId: string) => void;
}

/**
 * Result of a token request
 */
interface TokenRequestResult {
	/** Whether the request is allowed */
	allowed: boolean;

	/** Remaining tokens in the user's bucket */
	remainingTokens: number;

	/** Time until bucket refill in milliseconds (if not allowed) */
	timeUntilRefillMs?: number;
}

/**
 * User token bucket data
 */
interface UserBucket {
	/** Remaining tokens in the bucket */
	remainingTokens: number;

	/** Timestamp when the bucket was last refilled */
	lastRefillTimestamp: number;

	/** User's allocation including any bonuses */
	dailyAllocation: number;
}

/**
 * Token usage tracking
 */
interface TokenUsage {
	/** Total tokens used today */
	tokensUsedToday: number;

	/** Number of requests made today */
	requestsToday: number;

	/** History of token usage */
	usageHistory: Array<{
		timestamp: number;
		tokens: number;
		modelId: string;
	}>;
}

/**
 * Daily token bucket implementation
 */
export default class TokenBucket {
	private dailyTokenAllocation: number;
	private resetHourUTC: number;
	private userBonusTokens: Record<string, number>;
	private onTokensExhausted?: (userId: string) => void;

	// User data stores
	private userBuckets: Map<string, UserBucket> = new Map();
	private userUsage: Map<string, TokenUsage> = new Map();

	/**
	 * Create a new token bucket
	 */
	constructor(config: TokenBucketConfig) {
		this.dailyTokenAllocation = config.dailyTokenAllocation;
		this.resetHourUTC = config.resetHourUTC ?? 0; // Default to midnight UTC
		this.userBonusTokens = config.userBonusTokens ?? {};
		this.onTokensExhausted = config.onTokensExhausted;
	}

	/**
	 * Request tokens for a specific operation
	 * @param userId - User identifier
	 * @param tokens - Number of tokens requested
	 * @param modelId - Optional model identifier for tracking
	 * @returns Whether the request is allowed and remaining tokens
	 */
	public requestTokens(
		userId: string,
		tokens: number,
		modelId: string = "unknown"
	): TokenRequestResult {
		// Get or initialize user bucket
		const bucket = this.getUserBucket(userId);

		// Check for refill
		this.checkAndRefillBucket(userId, bucket);

		// Check if enough tokens are available
		if (bucket.remainingTokens < tokens) {
			const nextRefill = this.getTimeUntilNextRefill();

			// Notify if tokens are exhausted (first time)
			if (
				bucket.remainingTokens === bucket.dailyAllocation &&
				this.onTokensExhausted
			) {
				this.onTokensExhausted(userId);
			}

			return {
				allowed: false,
				remainingTokens: bucket.remainingTokens,
				timeUntilRefillMs: nextRefill,
			};
		}

		// Deduct tokens and record usage
		bucket.remainingTokens -= tokens;
		this.recordUsage(userId, tokens, modelId);

		return {
			allowed: true,
			remainingTokens: bucket.remainingTokens,
		};
	}

	/**
	 * Get a user's current token balance
	 */
	public getUserBalance(userId: string): {
		remainingTokens: number;
		dailyAllocation: number;
		usedToday: number;
		percentRemaining: number;
		timeUntilRefillMs: number;
	} {
		const bucket = this.getUserBucket(userId);
		this.checkAndRefillBucket(userId, bucket);

		const usage = this.getUserUsage(userId);

		return {
			remainingTokens: bucket.remainingTokens,
			dailyAllocation: bucket.dailyAllocation,
			usedToday: usage.tokensUsedToday,
			percentRemaining: Math.round(
				(bucket.remainingTokens / bucket.dailyAllocation) * 100
			),
			timeUntilRefillMs: this.getTimeUntilNextRefill(),
		};
	}

	/**
	 * Get detailed usage statistics for a user
	 */
	public getUserUsageStats(userId: string): {
		requestsToday: number;
		tokensUsedToday: number;
		dailyAllocation: number;
		remainingTokens: number;
		usageHistory: Array<{
			timestamp: number;
			tokens: number;
			modelId: string;
			date: string;
		}>;
	} {
		const bucket = this.getUserBucket(userId);
		const usage = this.getUserUsage(userId);

		return {
			requestsToday: usage.requestsToday,
			tokensUsedToday: usage.tokensUsedToday,
			dailyAllocation: bucket.dailyAllocation,
			remainingTokens: bucket.remainingTokens,
			usageHistory: usage.usageHistory.map((entry) => ({
				...entry,
				date: new Date(entry.timestamp).toISOString(),
			})),
		};
	}

	/**
	 * Add bonus tokens to a user's daily allocation
	 */
	public addBonusTokens(userId: string, bonusTokens: number): void {
		const currentBonus = this.userBonusTokens[userId] || 0;
		this.userBonusTokens[userId] = currentBonus + bonusTokens;

		// Update existing bucket if it exists
		const bucket = this.userBuckets.get(userId);
		if (bucket) {
			const oldAllocation = bucket.dailyAllocation;
			bucket.dailyAllocation =
				this.dailyTokenAllocation + this.userBonusTokens[userId];

			// Add the difference to remaining tokens
			bucket.remainingTokens += bucket.dailyAllocation - oldAllocation;
		}
	}

	/**
	 * Reset all user buckets (administrative function)
	 */
	private resetAllBuckets(): void {
		for (const userId of this.userBuckets.keys()) {
			this.resetUserBucket(userId);
		}
	}

	/**
	 * Reset a specific user's bucket
	 */
	public resetUserBucket(userId: string): void {
		const allocation =
			this.dailyTokenAllocation + (this.userBonusTokens[userId] || 0);

		this.userBuckets.set(userId, {
			remainingTokens: allocation,
			lastRefillTimestamp: Date.now(),
			dailyAllocation: allocation,
		});

		// Reset today's usage counters but keep history
		const usage = this.getUserUsage(userId);
		usage.tokensUsedToday = 0;
		usage.requestsToday = 0;
	}

	/**
	 * Get or initialize a user's bucket
	 */
	private getUserBucket(userId: string): UserBucket {
		const existing = this.userBuckets.get(userId);

		if (existing) {
			return existing;
		}

		// Calculate allocation including any bonuses
		const allocation =
			this.dailyTokenAllocation + (this.userBonusTokens[userId] || 0);

		// Initialize new bucket
		const newBucket: UserBucket = {
			remainingTokens: allocation,
			lastRefillTimestamp: Date.now(),
			dailyAllocation: allocation,
		};

		this.userBuckets.set(userId, newBucket);
		return newBucket;
	}

	/**
	 * Get or initialize user usage tracking
	 */
	private getUserUsage(userId: string): TokenUsage {
		const existing = this.userUsage.get(userId);

		if (existing) {
			return existing;
		}

		// Initialize new usage tracking
		const newUsage: TokenUsage = {
			tokensUsedToday: 0,
			requestsToday: 0,
			usageHistory: [],
		};

		this.userUsage.set(userId, newUsage);
		return newUsage;
	}

	/**
	 * Check if a bucket needs refilling and refill if necessary
	 */
	private checkAndRefillBucket(userId: string, bucket: UserBucket): void {
		const now = new Date();
		const lastRefill = new Date(bucket.lastRefillTimestamp);

		// Check if we've passed the reset hour today
		const todayRefill = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			this.resetHourUTC,
			0,
			0
		);

		// If the last refill was before today's reset hour and now is after reset hour
		if (lastRefill < todayRefill && now >= todayRefill) {
			this.resetUserBucket(userId);
		}
	}

	/**
	 * Record token usage for statistics
	 */
	private recordUsage(userId: string, tokens: number, modelId: string): void {
		const usage = this.getUserUsage(userId);

		usage.tokensUsedToday += tokens;
		usage.requestsToday += 1;
		usage.usageHistory.push({
			timestamp: Date.now(),
			tokens,
			modelId,
		});

		// Limit history length to avoid memory issues
		if (usage.usageHistory.length > 1000) {
			usage.usageHistory = usage.usageHistory.slice(-1000);
		}
	}

	/**
	 * Get time in milliseconds until the next refill
	 */
	private getTimeUntilNextRefill(): number {
		const now = new Date();

		// Today's reset time
		const todayReset = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate(),
			this.resetHourUTC,
			0,
			0
		);

		// If we haven't reached today's reset yet, use that
		if (now < todayReset) {
			return todayReset.getTime() - now.getTime();
		}

		// Otherwise, use tomorrow's reset
		const tomorrowReset = new Date(
			now.getFullYear(),
			now.getMonth(),
			now.getDate() + 1, // Next day
			this.resetHourUTC,
			0,
			0
		);

		return tomorrowReset.getTime() - now.getTime();
	}
}
