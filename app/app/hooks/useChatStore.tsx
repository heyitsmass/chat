"use client";
import { Conversation, Profile, SaveConvoProps } from "@/app/utils/types";
import { createClient } from "@/lib/utils/supabase/client";
import { User } from "@supabase/supabase-js";
import { del, get, set } from "idb-keyval";
import _ from "lodash";
import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { Merge } from "type-fest";
import { create, useStore } from "zustand";
import { createJSONStorage, persist, StateStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const indexDBStorage: StateStorage = {
	getItem: async (name: string) => {
		return (await get(name)) || null;
	},
	setItem: async (name: string, value: string) => {
		await set(name, value);
	},
	removeItem: async (name: string) => {
		await del(name);
	},
};

const supabaseDBStorage: StateStorage = {
	//@ts-expect-error
	getItem: async (name: string) => {
		const supabase = createClient();
	},
	setItem: async (name: string, value: string) => {},
	removeItem: async (name: string) => {},
};

interface Actions {}

export type Join<T, K> = T & K;

type _ChatStore<T extends boolean = boolean> = Merge<
	{
		user: User | { id: string };
		profile: Profile | null;
		conversations: Conversation[];
		signedIn: T;
	},
	Actions
>;

const createChatStore = ({ signedIn, ...props }: _ChatStore) => {
	return create<_ChatStore<typeof signedIn>>()(
		persist(
			immer((set, get) => {
				return {
					user: {
						id: crypto.randomUUID(),
					},
					profile: null,
					conversations: [],
					signedIn,
				};
			}),
			{
				name: "chat/store",
				storage: createJSONStorage(() => indexDBStorage),
				partialize: (state) => {
					if (!signedIn) {
						return {
							user: state.user,
							conversations: state.conversations,
						};
					}
				},
				merge: (presisted, current) => _.merge(current, presisted),
			}
		)
	);
};

type ChatStore = ReturnType<typeof createChatStore>;

const ChatStoreContext = createContext<ChatStore | null>(null);

const ChatStoreProvider = ({
	children,
	...props
}: PropsWithChildren<_ChatStore>) => {
	const ref = useRef<ChatStore | null>(null);
	if (!ref.current) {
		ref.current = createChatStore(props);
	}
	return (
		<ChatStoreContext.Provider value={ref.current}>
			{children}
		</ChatStoreContext.Provider>
	);
};

function useChatStore<T extends boolean = boolean>() {
	const store = useContext(ChatStoreContext);
	if (!store) throw new Error("Missing ChatStore.Provider in the tree");
	return useStore(store, (s) => s) as _ChatStore<T>;
}

export { ChatStoreProvider, useChatStore };
export default useChatStore;
