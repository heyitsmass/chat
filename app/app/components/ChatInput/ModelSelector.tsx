"use client";

import modelColors from "@/app/const/modelColors";
import modelIcons from "@/app/const/modelIcons";
import { Model } from "@/app/utils/types";
import { ChevronDown } from "lucide-react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { useChatInput } from "../../hooks";
import Dropdown from "../helpers/Dropdown";

function SelectableModel({
	isSelected,
	onModelChange,
	...model
}: Model & {
	onModelChange: (modelId: string) => void;
	isSelected?: boolean;
}) {
	const ModelIcon = modelIcons[model.icon || "Activity"];
	const modelColor = modelColors[model.icon || "Activity"] || "text-gray-400";

	return (
		<>
			<ModelIcon className={`w-6 h-6 ${modelColor}`} />
			<div className="flex-1 justify-items-start">
				<div className="text-white font-medium text-sm">
					{model.name}
				</div>
				<div className="text-xs text-gray-400">
					{model.short_description}
				</div>
			</div>
			<div className="selected-indicator"></div>
		</>
	);
}

export default function ModelSelector() {
	const { models, selectedModel, currentModel, onModelChange } =
		useChatInput();
	console.debug(models);
    
	const { ModelIcon, modelColor } = useMemo(() => {
		const iconName = currentModel?.icon || "Activity";
		return {
			ModelIcon: modelIcons[iconName],
			modelColor: modelColors[iconName] || "text-gray-400",
		};
	}, [currentModel.icon]);

	return (
		<Dropdown>
			<Dropdown.Toggle className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<ModelIcon className={`w-5 h-5 ${modelColor}`} />
					<span className="text-sm font-medium text-white hidden sm:inline">
						{currentModel.name}
					</span>
				</div>
				<ChevronDown className="w-4 h-4 text-gray-400" />
			</Dropdown.Toggle>
			<Dropdown.Menu title="Select Model">
				{models.map((model) => (
					<Dropdown.Item
						key={model.id}
						value={model.id}
						onClick={() => onModelChange(model.id)}
						className={twMerge(
							"flex gap-2 items-center",
							selectedModel === model.id ? "selected" : ""
						)}
					>
						<SelectableModel
							{...model}
							isSelected={selectedModel === model.id}
							onModelChange={onModelChange}
						/>
					</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
	);
}
