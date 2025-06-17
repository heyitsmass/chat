"use client";

import Chatbox from "@/app/app/components/Chatbox";
import { useModelStore } from "@/app/app/hooks/useModelStore";
import { ReloadFn } from "@/app/utils/types";
import { useChat } from "@ai-sdk/react";
import { UIMessage } from "ai";
import { CircleAlert } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { HiOutlineClipboardCheck } from "react-icons/hi";
import { HiOutlineClipboard } from "react-icons/hi2";
import { PiArrowsClockwise, PiCaretDown } from "react-icons/pi";
import { useChatStore } from "../../../hooks/useChatStore";
import Loader from "../../../components/Loader";

const Message = ({ ...props }: { [x: string]: any }) => {
	return <></>;
};

const ResponseGrid = ({
	messages,
	onRetry,
	status,
}: {
	messages: UIMessage[];
	onRetry: ReloadFn;
	status: "submitted" | "streaming" | "ready" | "error";
}) => {
	const isCopied = false;
	const onCopy = useCallback(() => {}, []);
	const ref = useRef<HTMLDivElement>(null);

	return (
		<div className="grid grid-rows-[1fr_auto] min-w-lg self-center max-w-4xl w-full pb-4">
			<div>
				{messages.map((m, i) => (
					<Message
						key={m.id}
						{...m}
						onRetry={onRetry}
						isLastMessage={i === messages.length - 1}
					/>
				))}
			</div>
			{messages.length > 0 && (
				<footer className=" w-full flex justify-between items-end px-2 pb-2 relative h-max">
					<Loader isLoading={status === "submitted"} />
					{status === "ready" && (
						<>
							<div className="flex flex-col">
								<div className="flex justify-end">
									<div className="rounded h-max w-max hover:bg-zinc-800">
										<button
											type="button"
											className="flex items-center h-full p-2 w-max"
											onClick={onCopy}
										>
											{isCopied ? (
												<HiOutlineClipboardCheck />
											) : (
												<HiOutlineClipboard />
											)}
										</button>
									</div>
									<div className="rounded h-max hover:bg-zinc-800 w-max">
										<button
											type="button"
											className="flex items-center h-full p-2"
										>
											<PiArrowsClockwise />
										</button>
									</div>
								</div>

								<p className="text-[10px] italic text-zinc-400 mr-2">
									Generated content may not be accurate.
									Double-check responses for accuracy.
								</p>
							</div>
						</>
					)}
					{status === "error" && (
						<div className="flex gap-2 text-sm items-center tracking-wide px-4 py-0.5 rounded-lg text-rose-400">
							<CircleAlert width={16} /> <p>An error occurred</p>
						</div>
					)}
				</footer>
			)}
		</div>
	);
};

export default function UnauthenticatedChat() {
	const { selectedModel, models } = useModelStore();
	const store = useChatStore();

	const { saveConversation } = store;

	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		id,
		reload,
		status,
	} = useChat({
		body: {
			model: selectedModel,
		},
		onFinish(message, options) {
			saveConversation(
				{
					id,
					messages: [...messages, message],
					model: selectedModel,
					pinned: false,
				},
				options.usage.totalTokens
			);
		},
	});

	const scrollAreaRef = useRef<HTMLElement>(null);
	const anchorRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		setTimeout(() => {
			if (!anchorRef.current) return;
			anchorRef.current!.scrollIntoView();
		}, 10);
	}, [, messages.length, status]);

	return (
		<section className="grid grid-rows-[auto_1fr_auto] h-screen w-full pb-4">
			<header className="h-max  py-4 pt-3 px-4 shadow-xl z-2 bg-zinc-800 border-b border-zinc-700">
				<div className="flex items-center gap-1.5 hover:bg-zinc-800 hover:neumorphism p-2 rounded text-sm w-max">
					<p>Some interesting title</p>
					<PiCaretDown className="mt-1" />
				</div>
			</header>
			<section
				className="overflow-y-scroll pt-4 flex flex-col"
				ref={scrollAreaRef}
			>
				<ResponseGrid
					messages={messages}
					onRetry={reload}
					status={status}
				/>
				<div ref={anchorRef} className="h-px" />
			</section>
			<section className="w-full flex justify-center">
				<Chatbox
					placeholder="Anything I can help with today?"
					value={input}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					className="mx-4"
				/>
			</section>
		</section>
	);
}
