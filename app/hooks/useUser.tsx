"use client";
import { createClient } from "@/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { redirect, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { generateSummary } from "../me/chat/helpers";
import { type UserProfile, UserConversation } from "../types";

const supabase = createClient();
const getUserData = async <T,>(
	table: string = "profiles",
	id: string,
	col: string = "id"
) => {
	const { data, error } = await supabase.from(table).select("*").eq(col, id);
	if (!error && data.length) return data as T[];
	else if (error) console.error(error);
};

export function useUser() {
	const pathname = usePathname();

	const [loading, setLoading] = useState(true);

	const [usage, setUsage] = useState(0);
	const [user, setUser] = useState<User>();
	const [profile, setProfile] = useState<UserProfile>();
	const [conversations, setConversations] = useState<UserConversation[]>();

	const getUser = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user && !pathname.includes("/login")) {
				redirect("/login");
			} else if (user) {
				setUser(user);

				const profiles = await getUserData<UserProfile>(
					"profiles",
					user.id
				);

				const conversations = await getUserData<UserConversation>(
					"history",
					user.id,
					"user_id"
				);

				if (profiles) {
					console.debug(profiles);
					const p = profiles[0];
					setProfile(p);
					setUsage(p.token_usage);
				}
				if (conversations) setConversations(conversations);
			}
		} catch (err) {
			console.error((err as Error).message);
		} finally {
			setLoading(false);
		}
	}, [pathname]);

	useEffect(() => {
		getUser();
	});

	const save = useCallback(
		async (
			conversation: Pick<UserConversation, "id" | "messages"> & {
				model: string;
			},
			usage: number
		) => {
			if (!user) return;

			const fullConvo: Omit<
				UserConversation,
				"created_at" | "title" | "pinned"
			> = {
				...conversation,
				user_id: user.id,
				updated_at: new Date(Date.now()).toUTCString(),
			};

			const { data, error } = await supabase
				.from("history")
				.select()
				.eq("id", conversation.id)
				.eq("user_id", user.id);

			if (error) throw error;
			if (data && data.length) {
				await supabase
					.from("history")
					.update({
						messages: fullConvo.messages,
						updated_at: fullConvo.updated_at,
					})
					.eq("id", conversation.id)
					.eq("user_id", user.id);
			} else if (!data?.length) {
				const entry = {
					...fullConvo,
					created_at: new Date(Date.now()).toUTCString(),
					title: await generateSummary(
						conversation.messages[0].content,
						conversation.model
					),
					pinned: false,
				};
				setConversations([entry, ...(conversations || [])]);
				await supabase.from("history").insert(entry);
			}

			await supabase
				.from("profiles")
				.update({ token_usage: usage })
				.eq("id", user.id);

			setUsage((prev) => prev + usage);
		},
		[user, conversations]
	);

	return [
		user,
		profile,
		conversations,
		loading,
		usage,
		(value: number) => setUsage((prev) => prev + value),
		save,
	] as
		| [
				user: User,
				profile: UserProfile,
				conversations: UserConversation[],
				loading: false,
				usage: number,
				updateUsage: (value: number) => void,
				save: (
					conversation: Pick<UserConversation, "id" | "messages"> & {
						model: string;
					},
					usage: number
				) => void
		  ]
		| [
				user: undefined,
				profile: undefined,
				conversations: undefined,
				loading: true,
				usage: 0,
				updateUsage: () => void,
				save: () => void
		  ];
}
