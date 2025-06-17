import Actions from "./Actions";
import Attachments from "./Attachments";
import Footer from "./Footer";
import ModelSelector from "./ModelSelector";
import Suggestions from "./Suggestions";
import TextInput from "./TextInput";

const ChatInput = () => {
	return (
		<div className="chat-input">
			<Suggestions />
			<div className="chat-input-content">
				<Attachments />
				<div className="text-input-container">
					<div className="text-input-content">
						<TextInput />
						<ModelSelector />
					</div>
					<Footer />
					<Actions />
				</div>
			</div>
		</div>
	);
};

ChatInput.Suggestions = Suggestions;
ChatInput.Attachments = Attachments;
ChatInput.Actions = Actions;
ChatInput.TextInput = TextInput;
ChatInput.ModelSelector = ModelSelector;
ChatInput.Footer = Footer;

export default ChatInput;
