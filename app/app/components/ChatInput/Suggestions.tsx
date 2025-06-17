import { useChatInput, useClientOnly } from "../../hooks";

export default function Suggestions() {
	const { suggestions, onSuggestionClick } = useChatInput();
	const isClient = useClientOnly();
	if (!isClient) return;
    
	return (
		<div className="suggestions">
			{suggestions.map((suggestion, index) => (
				<button
					key={index}
					onClick={() => onSuggestionClick(suggestion)}
					className="suggestion"
				>
					{suggestion.topic}
				</button>
			))}
		</div>
	);
}
