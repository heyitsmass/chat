import { Send } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { useChatInput } from "../../hooks";
import NeumorphicButton, {
	NeumorphicButtonProps,
} from "../helpers/NeumorphicButton";

const SendButton = ({
	className,
	disabled = false,
	...props
}: Omit<NeumorphicButtonProps, "title" | "icon">) => {
	return (
		<NeumorphicButton
			className={twMerge(className, "send")}
			title="Send Message"
			disabled={disabled}
			{...props}
		>
			<Send className="w-4.5 h-4.5 text-white" />
		</NeumorphicButton>
	);
};

export default function TextInput() {
	const { message, onMessageChange } = useChatInput();
	return (
		<div className="text-input">
			<div className="textbox-container">
				<textarea
					className="textbox"
					onChange={(e) => onMessageChange(e.target.value)}
					placeholder="Message AI..."
					style={{
						background: "transparent",
					}}
				/>
			</div>
			{/* Send Button */}
			<SendButton disabled={!message.trim()} />
		</div>
	);
}
