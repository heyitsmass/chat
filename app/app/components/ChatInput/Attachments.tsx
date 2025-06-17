"use client";

import { humanFileSize } from "@/app/utils";
import { FileText, Image, X } from "lucide-react";
import { useChatInput } from "../../hooks";

const Attachment = ({ ...file }: File) => {
	return (
		<div key={file.name} className="attachment">
			{file.type === "image" ? (
				<Image className="w-4 h-4 text-blue-400" />
			) : (
				<FileText className="w-4 h-4 text-green-400" />
			)}
			<span className="text-gray-300">{file.name}</span>
			<span className="text-gray-500 text-xs">
				({humanFileSize(file.size, true)})
			</span>
			<button className="opacity-0 group-hover:opacity-100 transition-opacity">
				<X className="w-4 h-4 text-gray-500 hover:text-red-400" />
			</button>
		</div>
	);
};

export default function Attachments() {
	const { attachments } = useChatInput();

	if (!attachments || attachments.length === 0) return null;

	return (
		<div className="attachments-bar">
			<div className="attachments-bar-content">
				<span className="attachments-bar-annotation">Attachments:</span>
				{attachments.map((file) => {
					return <Attachment key={file.name} {...file} />;
				})}
			</div>
		</div>
	);
}
