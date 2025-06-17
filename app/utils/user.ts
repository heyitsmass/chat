"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { User } from "@supabase/supabase-js";
import { generateSummary } from "./helpers";
import {
	Conversation,
	ConversationUpdate,
	SaveConvoProps,
	Profile,
} from "./types";
import { randomUUID } from "crypto";
import {
	AuthenticatedUser,
	UnauthenticatedUser,
} from "../app/hooks/useChatStore";

const getUserData = async <T>(
	table: string = "profiles",
	id: string,
	col: string = "id"
) => {
	const supabase = await createClient();
	const { data, error } = await supabase.from(table).select("*").eq(col, id);
	if (!error && data.length) return data as T[];
	else if (error) console.error(error);
};

const getProfile = async (user: User) =>
	getUserData<Profile>("profiles", user.id).then((res) => res?.[0]);

const getConversations = async (user: User) =>
	getUserData<Conversation>("history", user.id, "user_id");

async function getUser() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const [profile, convos] = await Promise.all([
			getProfile(user),
			getConversations(user),
		]);
		return {
			isSignedIn: true,
			user,
			profile: profile!,
			conversations: convos!,
		} as AuthenticatedUser & {
			isSignedIn: true;
		};
	}
	return {
		isSignedIn: false,
		user: {
			id: randomUUID(),
		},
		profile: null,
		conversations: [] as Conversation[],
	} as UnauthenticatedUser & {
		isSignedIn: false;
	};
	//throw new Error("User is not signed in.");
}

function buildConvo(userId: string, ...props: SaveConvoProps) {
	const [partial] = props;
	const conversation: Omit<
		Conversation,
		"created_at" | "updated_at" | "title"
	> = {
		...partial,
		user_id: userId,
		pinned: partial.pinned || false,
	};
	return conversation;
}

async function getConversation(userId: string, conversationId: string) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("history")
		.select("*")
		.eq("user_id", userId)
		.eq("id", conversationId);
	if (!data || error) throw error;
	if (data.length) return data[0] as Conversation;
	return null;
}

async function updateConversation(
	conversation: ConversationUpdate
): Promise<Conversation> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("history")
		.update({
			...conversation,
			updated_at: new Date(Date.now()).toUTCString(),
		})
		.eq("id", conversation.id)
		.eq("user_id", conversation.user_id)
		.select<"*", Conversation>();
	if (!data) throw error;

	return data[0];
}

async function createConversation(
	conversation: Omit<
		Conversation,
		"created_at" | "updated_at" | "pinned" | "title"
	>
) {
	const supabase = await createClient();
	const created_at = new Date(Date.now()).toUTCString();
	const entry: Conversation = {
		...conversation,
		created_at,
		updated_at: created_at,
		title: await generateSummary(
			conversation.messages[0].content,
			conversation.model
		),
		pinned: false,
	};

	await supabase.from("history").insert(entry);
	return entry;
}

async function updateUsage(userId: string, usage: number) {
	const supabase = await createClient();
	const { error } = await supabase
		.from("profiles")
		.update({ token_usage: usage })
		.eq("id", userId); //increase token usage.

	if (error) throw error;
}

async function handleSave(
	userId: string,
	conversations?: Conversation[],
	...props: SaveConvoProps
) {
	const [, usage] = props;

	const conversation = buildConvo(userId, ...props);

	const stored = await getConversation(userId, conversation.id);

	let entry;

	if (stored) {
		entry = await updateConversation(conversation);
	} else {
		entry = await createConversation(conversation);
	}

	await updateUsage(userId, usage);

	return {
		$state: {
			usage,
		},
		conversations: [entry, ...(conversations || [])],
	};
}

export { getUser, handleSave };
