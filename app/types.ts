import { User } from "@supabase/supabase-js";
import { UIMessage } from "ai";

enum UserRole {
	user = "user",
	admin = "admin",
}

enum UserPlan {
	basic = "basic",
	pro = "pro",
	premium = "premium",
}

enum TokenLimits {
	basic = 10000,
	pro = 100000,
	premium = 1000000,
}

export interface UserProfile {
	updated_at?: Date;
	username?: string;
	full_name?: string;
	avatar_url?: string;
	website?: string;
	role: UserRole;
	plan: UserPlan;
	token_limit: TokenLimits;
	token_usage: number;
}

export interface UserConversation {
	id: string;
	user_id: string;
	created_at: string;
	updated_at: string;
	messages: UIMessage[];
	model: string;
	title: string;
	pinned: boolean;
}

export interface Model<T extends string = string> {
	id: string;
	description: string;
	name: string;
	image_url?: string;
	provider: T;
}
