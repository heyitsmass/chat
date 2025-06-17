"use server";
import { createClient } from "@/lib/utils/supabase/server";
import { groq } from "@ai-sdk/groq";
import Groq from "groq-sdk";
import { generateText } from "ai";
import { Model } from "./types";

export async function getModelsByProvider(provider: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("models")
		.select()
		.eq("provider", provider);

	if (error) throw error;

	return (data ?? []) as Model[];
}

export async function getModels() {
	return new Groq({
		apiKey: process.env.GROQ_API_KEY,
	}).models.list();
}

export async function generateSummary(message: string, model: string) {
	const firstMessage = message.slice(0, 200);
	const { text } = await generateText({
		model: groq(model),
		prompt: `Generate a single line summary of the following text: "${firstMessage}"`,
	});
	return text;
}
