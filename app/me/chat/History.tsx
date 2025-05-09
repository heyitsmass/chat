import { UserConversation } from "@/app/types";
import {
	ChevronDoubleRightIcon,
	ChevronDoubleLeftIcon,
	EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import Select from "react-select/base";

const Conversation = ({ ...convo }: UserConversation) => {
	const [ellipsisHovered, setEllipsesHovered] = useState(false);
	const [isHovered, setIsHovered] = useState(false);
	const options = [
		{ value: "delete", label: "Delete" },
		{ value: "rename", label: "Rename" },
		{ value: "pin", label: convo.pinned ? "Unpin" : "pin" },
	];
	return (
		<li
			key={convo.id}
			className={`line-clamp-1 text-sm py-1  items-center relative flex overflow-ellipsis text-nowrap !cursor-pointer ${
				isHovered ? "" : "text-zinc-400"
			}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<p className="overflow-ellipsis text-nowrap overflow-hidden">
				{convo.title}
			</p>
			{/** TODO: implementation  */}
			{isHovered && (
				<EllipsisVerticalIcon
					width={24}
					onMouseEnter={() => setEllipsesHovered(true)}
					onMouseLeave={() => setEllipsesHovered(false)}
					className={`${
						ellipsisHovered ? "" : "opacity-50"
					} text-white absolute right-0 border border-zinc-900 rounded-md w-max bg-zinc-800`}
				/>
			)}
		</li>
	);
};

export default function History({
	conversations,
}: {
	conversations: UserConversation[];
}) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<aside
			className={`${
				isOpen ? "max-w-60" : "max-w-16 items-center"
			} flex flex-col h-full border border-solid border-r-0 rounded-tl-lg rounded-bl-lg w-full`}
		>
			<div className="flex justify-between pt-2 px-2 min-w-max gap-2">
				<button
					type="button"
					className="border rounded-md p-[4px] cursor-pointer"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? (
						<ChevronDoubleRightIcon
							title={"Show Sidebar"}
							width={24}
						/>
					) : (
						<ChevronDoubleLeftIcon
							title="Hide Sidebar"
							width={24}
						/>
					)}
				</button>
				{isOpen && <h2>Recent</h2>}
			</div>
			{isOpen && (
				<ol className="p-2">
					{conversations.slice(0, 20).map((convo) => {
						return <Conversation key={convo.id} {...convo} />;
					})}
				</ol>
			)}
		</aside>
	);
}
