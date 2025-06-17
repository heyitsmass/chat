import { Enums, Tables, TablesUpdate } from "@/supabase/types";
import { HomeModernIcon } from "@heroicons/react/24/outline";
import { User } from "@supabase/supabase-js";
import { ChatRequestOptions, ModelMessage } from "ai";
import type { RequireExactlyOne, SetRequired } from "type-fest";
import MODEL_FEATURE_MAP from "../const/modelIcons";
import Groq from "groq-sdk";

export type Conversation = Tables<"conversations">;
export type Profile = Tables<"profiles">;
export type Model = Groq.Models.Model;

export type Role = Enums<"user_role">;
export type Plan = Enums<"plan">;

export type TokenLimits = {
	free: 1e4;
	silver: 1e5;
	gold: 1e6;
	diamond: 1e7;
	emerald: 1e8;
	sapphire: -1; // Unlimited tokens
};

export type Feature = keyof typeof MODEL_FEATURE_MAP;

export type SimpleMessage = Pick<ModelMessage, "content" | "role">;

export type SaveConvoProps = [
	conversation: Pick<Conversation, "id" | "messages" | "pinned"> & {
		model: string;
	},
	usage: number
];

export type UninitializedUser = {
	user: null;
	profile: null;
	convos: null;
	usage: null;
	is_initialized: false;
	init(): Promise<void>;
	save?(): void;
};

type IconType = typeof HomeModernIcon;

export type SuggestionProps = {
	label: string;
	value: string;
	icon: IconType;
};

export type InitializedUser = {
	user: User;
	profile: Profile;
	convos: Conversation[];
	usage: number;
	is_initialized: boolean;
	init: () => Promise<void>;
	save: (...props: SaveConvoProps) => void;
};

export type RequiredUpdateKeys = "id" | "user_id" | "messages";

export type ConversationUpdate = SetRequired<
	TablesUpdate<"conversations">,
	RequiredUpdateKeys
>;

export interface Store {
	store: {
		[x: string]: any;
	};
	useStoredValue<T>(
		key: string,
		defaultValue: T
	): [value: T, setValue: (value: T) => void];
}

export type ReloadFn = (
	chatRequestOptions?: ChatRequestOptions
) => Promise<string | null | undefined>;
