"use server";

import { createClient } from "@/lib/utils/supabase/server";
import { User } from "@supabase/supabase-js";

type Supabase = Awaited<ReturnType<typeof createClient>>;

function withUser<
	T extends (user: User, supabase: Supabase, ...args: any[]) => any
>(func: T) {
	return async (
		...args: Parameters<T> extends [any, any, ...infer Rest] ? Rest : never
	) => {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) throw new Error("User is not signed in.");
		return func(user, supabase, ...args) as ReturnType<T>;
	};
}

const deleteMultipleConversations = withUser(async function (
	user: User,
	supabase: Supabase,
	...ids: string[]
) {
	const { error } = await supabase
		.from("history")
		.delete()
		.in("id", ids)
		.eq("user_id", user.id);
	if (error) throw error;
});

const deleteUserConversation = withUser(async function (
	user: User,
	supabase: Supabase,
	id: string
) {
	const { error } = await supabase
		.from("history")
		.delete()
		.eq("id", id)
		.eq("user_id", user.id);

	if (error) throw error;
});

export { deleteMultipleConversations, deleteUserConversation };
