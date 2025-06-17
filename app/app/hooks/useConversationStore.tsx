"use client";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Conversation } from "../../utils/types";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { enableMapSet } from "immer";
import {
	deleteMultipleConversations,
	deleteUserConversation,
} from "../../utils/conversations";

interface ConversationHistory {
	isActive: boolean;
	conversations: Conversation[];
	selected: Set<string>;
	readonly total: number;
	limit?: number;
}
interface ConversationHistoryActions {
	toggleActive: () => void;
	toggleSelected: (id: string) => void;
	setLimit: (limit?: number) => void;
	startEdit: () => void;
	cancelEdits: () => void;
	selectAll: () => void;
	deselectAll: () => void;
	deleteSelected: () => void;
	deleteConversation: (id: string) => void;
}
const createConversationStore = (initProps?: Partial<ConversationHistory>) => {
	const conversations = initProps?.conversations || [];

	const defaultProps: ConversationHistory = {
		conversations,
		selected: new Set(),
		isActive: false,
		limit: conversations.length > 20 ? 20 : undefined,
		total: conversations.length,
	};
	enableMapSet();

	return create<ConversationHistory & ConversationHistoryActions>()(
		immer((set, get) => {
			return {
				...defaultProps,
				...initProps,
				toggleActive: () =>
					set((state) => ({ isActive: !state.isActive })),
				toggleSelected: (id: string) =>
					set((state) => {
						if (!state.isActive) state.isActive = true;
						if (state.selected.has(id)) {
							state.selected.delete(id);
							if (state.selected.size <= 0)
								state.isActive = false;
						} else state.selected.add(id);
					}),
				startEdit: () => {
					set({ isActive: true });
				},
				cancelEdits: () => {
					set((state) => {
						state.selected.clear();
						state.isActive = false;
					});
				},
				selectAll: () => {
					set((state) => {
						for (const { id } of state.conversations) {
							state.selected.add(id);
						}
					});
				},
				deselectAll: () => {
					set((state) => {
						state.selected = new Set();
					});
				},
				setLimit: (limit?: number) => {
					set({ limit });
				},
				deleteSelected: async () => {
					const { selected, conversations } = get();
					await deleteMultipleConversations(...Array.from(selected));
					set({
						conversations: conversations.filter(
							(v) => !selected.has(v.id)
						),
						selected: new Set(),
					});
				},
				deleteConversation: async (id: string) => {
					await deleteUserConversation(id);
					set((state) => {
						return {
							conversations: state.conversations.filter(
								(v) => v.id !== id
							),
						};
					});
				},
			};
		})
	);
};

type ConversationsStore = ReturnType<typeof createConversationStore>;
type Conversations = ConversationHistory & ConversationHistoryActions;

const ConversationsContext = createContext<ConversationsStore | null>(null);

const ConversationStoreProvider = ({
	children,
	...props
}: PropsWithChildren<Partial<ConversationHistory>>) => {
	const conversationRef = useRef<ConversationsStore | null>(null);
	if (!conversationRef.current) {
		conversationRef.current = createConversationStore(props);
	}
	return (
		<ConversationsContext.Provider value={conversationRef.current}>
			{children}
		</ConversationsContext.Provider>
	);
};

function useConversationStore(
	selector?: (state: Conversations) => Conversations
): Conversations {
	const store = useContext(ConversationsContext);
	if (!store)
		throw new Error("Missing ConversationStore.Provider in the tree");
	return useStore(store, selector || ((s) => s));
}

export { ConversationStoreProvider, useConversationStore };
export default useConversationStore;