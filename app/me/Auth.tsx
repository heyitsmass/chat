"use server";
import { createClient } from "@/utils/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";
import { redirect, RedirectType } from "next/navigation";
import { PropsWithChildren } from "react";

export default async function Auth({ children }: PropsWithChildren) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login", RedirectType.replace);
	}
	return <>{children}</>;
}
