"use client";
import { Model } from "@/app/utils/types";
import { getRandomSuggestions, Suggestion } from "@/lib/suggestions";
import _ from "lodash";
import React, { createContext } from "react";
import { Merge, SetRequired } from "type-fest";
import { create, useStore } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { indexDBStorage } from "../stores";

type TChatInput = {
	attachments: File[];
	suggestions: Suggestion[];
	message: string;
	models: Model[];
	selectedModel: string;
	currentModel: Model;
	showModelMenu: boolean;
};

type TChatInputActions = {
	onSuggestionClick: (suggestion: Suggestion) => void;
	onMessageChange: (message: string) => void;
	toggleModelMenu: () => void;
	onModelChange: (model: string) => void;
};

type TChatInputStore = Merge<TChatInput, TChatInputActions>;

type CreateChatInputStoreProps = SetRequired<
	Partial<TChatInputStore>,
	"models"
>;

const createChatInputStore = (props: CreateChatInputStoreProps) => {
	return create<TChatInputStore>()(
		persist(
			immer((set, get) => {
				const defaultModel = "gemma2-9b-it";
				return _.merge(props, {
					suggestions: getRandomSuggestions(5),
					onSuggestionClick: (suggestion: Suggestion) => {
						set({ message: suggestion.topic });
					},
					onMessageChange: (message: string) => {
						set({ message });
					},
					message: "",
					attachments: [],
					models: [],
					selectedModel: defaultModel,
					currentModel: props.models.find(
						(v) => v.id === defaultModel
					)!,
					showModelMenu: false,
					toggleModelMenu: () => {
						set((state) => ({
							showModelMenu: !state.showModelMenu,
						}));
					},
					onModelChange: (model: string) => {
						set({
							selectedModel: model,
							currentModel: get().models.find(
								(m) => m.id === model
							),
						});
					},
				});
			}),
			{
				name: "chat/input",
				storage: createJSONStorage<
					Required<Omit<CreateChatInputStoreProps, "models">>
				>(() => indexDBStorage),
				partialize: ({ models, ...state }) => state,
				merge: (persisted, current) => _.merge(current, persisted),
			}
		)
	);
};

type ChatInputStore = ReturnType<typeof createChatInputStore>;
const ChatInputStoreContext = createContext<ChatInputStore | null>(null);

const ChatInputStoreProvider = ({
	children,
	...props
}: React.PropsWithChildren<CreateChatInputStoreProps>) => {
	const ref = React.useRef<ChatInputStore | null>(null);
	if (!ref.current) {
		ref.current = createChatInputStore(props);
	}
	return (
		<ChatInputStoreContext.Provider value={ref.current}>
			{children}
		</ChatInputStoreContext.Provider>
	);
};

const useChatInput = (
	selector?: (state: TChatInputStore) => TChatInputStore
) => {
	const context = React.useContext(ChatInputStoreContext);
	if (!context) {
		throw new Error("useChatInput must be used within a ChatInputProvider");
	}
	return useStore(context, selector || ((s) => s)) as TChatInputStore;
};
export { ChatInputStoreProvider, useChatInput };
export default useChatInput;
