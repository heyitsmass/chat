"use server";
import { createClient } from "@/utils/supabase/server";
import { groq } from "@ai-sdk/groq";
import { generateText } from "ai";
import { Model } from "../../types";

export async function getModelsByProvider<T extends string>(provider: T) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("models")
		.select()
		.eq("provider", provider);

	if (error) throw error;

	return (data ?? []) as Model<T>[];
}

export async function getModels() {
	const supabase = await createClient();

	const { data, error } = await supabase.from("models").select();

	if (error) throw error;

	return (data ?? []) as Model[];
}

export async function generateSummary(message: string, model: string) {
	const firstMessage = message.slice(0, 200);
	const { text } = await generateText({
		model: groq(model),
		prompt: `Generate a single line summary of the following text: "${firstMessage}"`,
	});
	return text;
}
