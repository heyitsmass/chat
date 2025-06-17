import { createClient } from "@/lib/utils/supabase/client";
import { StateStorage } from "zustand/middleware";

const supabaseDBStorage: StateStorage = {
	getItem: async (name: string) => {
		const supabase = createClient();
		const { data, error } = await supabase
			.from("storage")
			.select("value")
			.eq("key", name)
			.single();
		if (error) {
			console.error("Error fetching item from Supabase:", error);
			return null;
		}
		return data ? data.value : null;
	},
	setItem: async (name: string, value: string) => {
		const supabase = createClient();
		await supabase.from("storage").upsert({ key: name, value });
	},
	removeItem: async (name: string) => {
		const supabase = createClient();
		await supabase.from("storage").delete().eq("key", name);
	},
};

export default supabaseDBStorage;
export { supabaseDBStorage };
