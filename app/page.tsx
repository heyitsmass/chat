"use client";

import ChatInput from "./app/components/ChatInput";

export default function Page() {
	return <ChatInput />;
}
/**
export default function Page() {
	const { signedIn } = useChatStore();
	const { model } = useModelStore();

	const suggestions = [] as SuggestionProps[];
	const version = "v0.0.1";
	const currentTier: string = "Free";
	const maxTier: string = "Premium";

	return (
		<div className="max-h-screen h-screen w-screen flex items-center justify-center relative">
			<section className="rounded-lg w-5xl h-1/2 grid grid-rows-[auto_1fr]">
				<div>
					<div className="flex items-center">
						<h1 className="font-bold font-heading text-5xl mb-1">
							MassChat
						</h1>
						<div className="bg-zinc-800 border-zinc-700 ml-6 border border-solid px-4 py-0.25 text-sm rounded-2xl font-mono">
							{version}
						</div>
						{signedIn ? (
							<div className="ml-6 text-xs border-zinc-700 bg-zinc-800 border border-solid cursor-default flex items-center text-normal p-1 px-2 rounded-lg">
								<p>{currentTier} Tier</p>

								{currentTier !== maxTier && (
									<>
										<LuDot className="text-xl" />
										<p className="text-[#BA88FF] hover:underline">
											Upgrade
										</p>
									</>
								)}
							</div>
						) : (
							<div className="ml-6 text-xs border-zinc-700 bg-zinc-800 border border-solid cursor-default flex items-center text-normal p-1 px-2 rounded-lg">
								<a>Login</a>
							</div>
						)}
					</div>

					<h4 className="text-md">
						providing a unified source for everything AI
					</h4>
					<h2 className="font-semibold text-3xl mt-8 mb-18">
						Ask {model.name} Anything, Explore Infinite Knowledge.
					</h2>
				</div>
				<PseudoChatbox placeholder="Anything I can help with today?" />
				<div className="h-full grid grid-rows-[1fr_auto]">
					<ol className="h-48 min-h-max">
						{suggestions.length > 0 &&
							[
								...suggestions,
								{
									label: "More",
									value: "more",
									icon: EllipsisVerticalIcon,
								},
							].map((suggestion) => {
								return (
									<Suggestion
										key={suggestion.value}
										{...suggestion}
									/>
								);
							})}
					</ol>
				</div>
			</section>
		</div>
	);
}
 */
