"use client";
import { useModel } from "@/app/hooks/useModel";
import { useUser } from "@/app/hooks/useUser";
import { useChat } from "@ai-sdk/react";
import History from "./History";
import Models from "./models";
import { Model } from "@/app/types";
import { use } from "react";
import { UIMessage } from "ai";

export default function Chat({
	models: modelsPromise,
}: {
	models: Promise<Model[]>;
}) {
	const models = use(modelsPromise);
	const { selectedModel } = useModel();
	const [, , conversations, loading, , , save] = useUser();

	const { messages, input, handleInputChange, handleSubmit, id } = useChat({
		body: {
			model: selectedModel,
		},
		onFinish(message, options) {
			save(
				{
					id,
					messages: [...messages, message as UIMessage],
					model: selectedModel,
				},
				options.usage.totalTokens
			);
		},
	});

	if (loading) return;

	return (
		<div className="flex w-full h-full">
			<Models models={models} />

			<div className="w-full grid grid-rows-[1fr_auto] min-w-2xl">
				<div className="px-2 h-full">
					<div className="border border-solid h-full rounded-lg">
						{messages.map((m) => (
							<div key={m.id}>
								{m.role === "user" ? "User: " : "AI: "}
								{m.content}
							</div>
						))}
					</div>
				</div>
				<section className="flex p-2 pb-0">
					<form
						onSubmit={handleSubmit}
						className="border border-solid w-full p-4 rounded-lg"
					>
						<textarea
							className="resize-none w-full outline-0"
							value={input}
							placeholder="Say something..."
							onChange={handleInputChange}
						/>
						<button type="submit">Send</button>
					</form>
				</section>
			</div>
			<History conversations={conversations || []} />
		</div>
	);
}
