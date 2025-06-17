"use client";
import { useConversationStore } from "@/app/app/hooks/useConversationStore";
import { Conversation } from "@/app/utils/types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { BiCheck } from "react-icons/bi";
import { HiOutlineTrash } from "react-icons/hi2";

const HistoricalConversation = ({
	toggleSelected,
	deleteSelected,
	isActive,
	...convo
}: Conversation & {
	selected: Set<string>;
	isActive: boolean;
	toggleSelected: () => void;
	deleteSelected: () => void;
}) => {
	const [isCardHovered, setIsCardHovered] = useState(false);
	const [isDeleteHovered, setIsDeleteHovered] = useState(false);
	const message = useMemo(() => {
		const lastMessage = new Date(Date.parse(convo.updated_at));
		const currentTime = new Date(Date.now());
		const diff = currentTime.valueOf() - lastMessage.valueOf();

		const days = Math.floor(diff / 1000 / 60 / 60 / 24);
		const months = Math.floor(days / 30);
		const years = Math.floor(days / 365);

		let message = `Last message sent ${days} day${days > 1 ? "s" : ""} ago`;

		if (years > 0) {
			message = `Last message sent ${years} year${
				years > 1 ? "s" : ""
			} ago`;
		} else if (months > 0) {
			message = `Last message sent ${months} month${
				months > 1 ? "s" : ""
			} ago`;
		}

		return message;
	}, [convo.updated_at]);

	const isSelected = useMemo(() => {
		return convo.selected.has(convo.id);
	}, [convo.selected]);

	return (
		<div
			className="relative hover:border-zinc-700 cursor-pointer hover:bg-zinc-900 border border-solid p-8 rounded-xl border-zinc-700 bg-zinc-800"
			onMouseEnter={() => setIsCardHovered(true)}
			onMouseLeave={() => setIsCardHovered(false)}
		>
			{(isCardHovered || isActive) && (
				<div
					onClick={toggleSelected}
					className="border border-solid h-6 w-6 absolute left-0 -translate-x-1/2 translate-y-1/2 bottom-1/2 rounded-md bg-zinc-700 border-zinc-600 hover:bg-zinc-600 hover:border-zinc-500"
				>
					<input type="checkbox" hidden defaultChecked={isSelected} />
					{isSelected ? <BiCheck /> : null}
				</div>
			)}
			<p className="text-xl font-semibold tracking-wide mb-1">
				{convo.title}
			</p>
			<p className="opacity-70">{message}</p>
			<div
				className={`absolute border ${
					isCardHovered
						? "right-4"
						: "right-0 translate-x-12 opacity-0"
				} top-4 text-2xl  p-1 w-max rounded-md text-zinc-300 ${
					isDeleteHovered
						? "bg-zinc-600 border-zinc-500"
						: "border-transparent"
				}`}
				onMouseEnter={() => setIsDeleteHovered(true)}
				onMouseLeave={() => setIsDeleteHovered(false)}
				onClick={deleteSelected}
			>
				<HiOutlineTrash />
			</div>
		</div>
	);
};

export default function Conversations() {
	const {
		limit,
		setLimit,
		selectAll,
		toggleSelected,
		deleteConversation,
		deleteSelected,
		conversations,
		selected,
		isActive,
		startEdit,
		cancelEdits,
	} = useConversationStore();

	return (
		<div className="border h-full overflow-y-scroll flex flex-col items-center py-4">
			<div className="w-7xl flex flex-col items-center gap-2">
				<h2 className="self-start text-3xl font-semibold tracking-wide">
					Your Conversation History
				</h2>
				<div className="border border-solid flex px-4 gap-4 w-full bg-zinc-700 border-zinc-600 rounded-lg">
					<MagnifyingGlassIcon width={20} />
					<input
						type="search"
						placeholder="Search your conversations...."
						className="py-3 outline-none border-none text-lg w-full tracking-wider"
					></input>
				</div>
				<nav className="flex w-full items-center">
					{isActive ? (
						<p className="self-start text-lg font-extralight tracking-wide w-max">
							{selected.size} selected conversations.
						</p>
					) : (
						<p className="self-start text-lg font-extralight tracking-wide w-max">
							You have <b>{conversations.length}</b> previous
							conversations
						</p>
					)}
					<div className="px-2 flex justify-between items-center">
						{!isActive && (
							<p
								className="text-lg text-sky-500 cursor-pointer hover:underline"
								onClick={startEdit}
							>
								Select
							</p>
						)}
						{isActive && (
							<div className="flex gap-2 items-center">
								<button
									type="button"
									className="hover:bg-zinc-600 hover:border-zinc-500 cursor-pointer flex items-center justify-center border py-1 px-4 rounded-md bg-zinc-700 border-zinc-600 tracking-wide"
									onClick={cancelEdits}
								>
									Cancel
								</button>
								<button
									type="button"
									className="disabled:opacity-80 disabled:pointer-events-none text-zinc-50 hover:text-zinc-200 hover:bg-rose-600 hover:border-rose-500 cursor-pointer border items-center justify-center  py-1 px-4 rounded-md bg-red-700  border-rose-600 tracking-wide"
									disabled={selected.size <= 0}
									onClick={deleteSelected}
								>
									Delete Selected
								</button>
								<button
									type="button"
									className="disabled:opacity-80 disabled:pointer-events-none text-zinc-50 hover:text-zinc-200 hover:bg-indigo-600 hover:border-indigo-500 cursor-pointer border items-center justify-center  py-1 px-4 rounded-md bg-indigo-700  border-indigo-600 tracking-wide"
									onClick={selectAll}
								>
									Select All
								</button>
							</div>
						)}
					</div>
				</nav>

				<ol className="flex flex-col gap-2 w-full">
					{conversations.slice(0, limit).map((convo) => {
						return (
							<li key={convo.id}>
								<HistoricalConversation
									{...convo}
									selected={selected}
									isActive={isActive}
									toggleSelected={() =>
										toggleSelected(convo.id)
									}
									deleteSelected={async () =>
										deleteConversation(convo.id)
									}
								/>
							</li>
						);
					})}
				</ol>
				{limit && (
					<button
						type="button"
						className="border py-2.5 w-full rounded-lg tracking-wide font-semibold text-xl cursor-pointer bg-zinc-800 border-zinc-700"
						onClick={() => setLimit(undefined)}
					>
						Show All
					</button>
				)}
			</div>
		</div>
	);
}
