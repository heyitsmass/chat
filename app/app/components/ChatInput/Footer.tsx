import modelColors from "@/app/const/modelColors";
import { useModelStore } from "../../hooks/useModelStore";
import { useChatInput } from "../../hooks";

export default function Footer() {
	const { currentModel } = useChatInput();

	const color = modelColors[currentModel.icon] || "text-gray-400";
	return (
		<div className="flex items-center justify-between mt-6 px-2">
			<div className="flex items-center space-x-4 text-xs text-gray-500">
				<span>Press Enter to send • Shift + Enter for new line</span>
			</div>
			<div className="flex items-center space-x-2 text-xs text-gray-500">
				<span>Powered by</span>
				<span className={`font-medium ${color}`}>
					{currentModel.name}
				</span>
			</div>
		</div>
	);
}
