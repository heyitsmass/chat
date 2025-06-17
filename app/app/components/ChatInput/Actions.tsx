"use client";

import { Clapperboard, Mic, Paperclip, Sparkles, Webcam } from "lucide-react";
import NeumorphicButton from "../helpers/NeumorphicButton";

const FileUploadButton = () => {
	return (
		<NeumorphicButton
			className="group cursor-pointer"
			title="Upload File"
			icon
		>
			<Paperclip className="w-5 h-5 text-gray-400  group-hover:rotate-12 group-hover:text-blue-400 group-active:text-blue-400 transition-transform duration-200" />
		</NeumorphicButton>
	);
};

const AppUploadButton = () => {
	return (
		<NeumorphicButton
			className="group cursor-pointer"
			title="Upload via App"
			icon
		>
			<Sparkles className="w-5 h-5 text-gray-400 group-hover:text-yellow-400  transition-colors duration-200" />
		</NeumorphicButton>
	);
};

const RecordAudioButton = () => {
	return (
		<NeumorphicButton
			className="group cursor-pointer"
			title="Record Audio"
			icon
		>
			<Mic className="w-5 h-5 text-gray-400 group-hover:text-green-400 transition-colors duration-200" />
		</NeumorphicButton>
	);
};

const TakePhotoButton = () => {
	return (
		<NeumorphicButton
			className="group cursor-pointer"
			title="Take Photo"
			icon
		>
			<Webcam className="w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200" />
		</NeumorphicButton>
	);
};

const VideoUploadButton = () => {
	return (
		<NeumorphicButton
			className="group cursor-pointer"
			title="Upload Video"
			icon
		>
			<Clapperboard className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
		</NeumorphicButton>
	);
};

const Actions = () => {
	return (
		<div className="flex space-x-2">
			<FileUploadButton />
			<AppUploadButton />
			<RecordAudioButton />
			<TakePhotoButton />
			<VideoUploadButton />
		</div>
	);
};
export default Actions;
export {
	AppUploadButton,
	FileUploadButton,
	Actions,
	RecordAudioButton,
	TakePhotoButton,
	VideoUploadButton,
};
