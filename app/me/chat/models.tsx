"use client";

import { useModel } from "@/app/hooks/useModel";
import { Model } from "@/app/types";
import {
	ChevronDoubleLeftIcon,
	ChevronDoubleRightIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useRef, useState } from "react";

export default function Models({ models }: { models: Model[] }) {
	const ref = useRef<HTMLOListElement>(null);
	const [isOpen, setIsOpen] = useState(false);
	const { selectedModel, setSelectedModel, setModels } = useModel();

	useEffect(() => {
		setModels(models);
		setSelectedModel(selectedModel);
		if (ref.current) {
			const sorted = Array.from(ref.current.children).toSorted(
				(a, b) => b.clientWidth - a.clientWidth
			);
			ref.current.replaceChildren(...sorted);
		}
	});

	return (
		<aside
			className={`${
				isOpen ? "max-w-60" : "max-w-16 items-center"
			} border border-solid border-l-0 h-full flex flex-col rounded-tr-lg rounded-br-lg w-full`}
		>
			<div className="flex justify-between pt-2 px-2">
				{isOpen && <h2>Supported Models</h2>}
				<button
					type="button"
					className="border rounded-md p-[4px] cursor-pointer"
					onClick={() => setIsOpen(!isOpen)}
				>
					{isOpen ? (
						<ChevronDoubleLeftIcon
							title="Hide Sidebar"
							width={24}
						/>
					) : (
						<ChevronDoubleRightIcon
							title={"Show Sidebar"}
							width={24}
						/>
					)}
				</button>
			</div>
			{isOpen && (
				<ol className="p-4 pl-0 pr-8 flex flex-col gap-2" ref={ref}>
					{models.map((model) => {
						return (
							<li
								className={`border border-solid px-2 py-2 border-l-0 rounded-tr-lg rounded-br-lg cursor-pointer text-sm text-end ${
									model.id === selectedModel
										? "w-full"
										: "w-max"
								}`}
								key={model.id}
								onClick={() => setSelectedModel(model.id)}
							>
								{model.name}
							</li>
						);
					})}
				</ol>
			)}
		</aside>
	);
}
