import { AccountForm } from "./components";
import { createClient } from "@/lib/utils/supabase/server";

export default async function Account() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return <AccountForm user={user} />;
}
