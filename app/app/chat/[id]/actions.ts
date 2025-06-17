"use server";
import { createClient } from "@/lib/utils/supabase/server";

export async function isUserLoggedIn() {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	return !!user;
}

export async function simulateStreamingResponse(
	response: string,
	onChunk: (chunk: string) => void,
	onComplete: () => void
) {
	const words = response.split(" ");
	let currentContent = "";

	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		currentContent += (i === 0 ? "" : " ") + word;
		onChunk(currentContent);

		// Random delay between 50-150ms to simulate realistic streaming
		const delay = Math.random() * 100 + 50;
		await new Promise((resolve) => setTimeout(resolve, delay));
	}

	onComplete();
}
