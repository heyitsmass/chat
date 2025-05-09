// app/api/chat/route.ts
import { UserProfile } from "@/app/types";
import { createClient } from "@/utils/supabase/server";
import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		const { data } = await supabase
			.from("profiles")
			.select()
			.eq("id", user.id);
		if (data) {
			const profile = data[0] as UserProfile;
			if (profile.token_usage >= profile.token_limit)
				throw new Error("Maximum token allowance met.");
		}
	}

	// Extract the `messages` from the body of the request
	const { messages, model } = await req.json();

	// Call the language model
	const result = streamText({
		model: groq(model),
		messages,
	});

	// Respond with the stream
	return result.toDataStreamResponse();
}
