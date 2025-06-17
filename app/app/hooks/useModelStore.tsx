"use client";
import _ from "lodash";
import { create, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Model } from "../../utils/types";
import { createJSONStorage, persist } from "zustand/middleware";
import { createContext, PropsWithChildren, useContext, useRef } from "react";

type _Store = {
	/** The id of the currently selected model */
	selectedModel: string;
	/** The list of all models */
	models: Model[];
	/** The model referencing the selected id */
	model: Model;
};

type _Actions = {
	setSelectedModel: (model: string) => void;
};

type TModelStore = _Store & _Actions;

const createModelStore = (
	props: Partial<Omit<_Store, "models">> & Pick<_Store, "models">
) => {
	const defaultModel = "gemma2-9b-it";

	const defaultProps: _Store = {
		selectedModel: defaultModel,
		models: props.models,
		model: props.models.find((v) => v.id === defaultModel)!,
	};

	return create<TModelStore>()(
		persist(
			immer((set, get) => {
				return {
					...defaultProps,
					setSelectedModel(id: string) {
						set({ selectedModel: id });
						set((state) => {
							state.model = state.models.find(
								(m) => m.id === id
							)!;
						});
					},
				};
			}),
			{
				name: "model",
				storage: createJSONStorage<Pick<_Store, "model" | "selectedModel">>(() => localStorage),
			}
		)
	);
};

type ModelStore = ReturnType<typeof createModelStore>;
const ModelStoreContext = createContext<ModelStore | null>(null);
const ModelStoreProvider = ({
	children,
	...props
}: PropsWithChildren<Pick<_Store, "models">>) => {
	const modelStoreRef = useRef<ModelStore | null>(null);

	if (!modelStoreRef.current) {
		modelStoreRef.current = createModelStore(props);
	}
	return (
		<ModelStoreContext.Provider value={modelStoreRef.current}>
			{children}
		</ModelStoreContext.Provider>
	);
};
function useModelStore(
	selector?: (state: TModelStore) => TModelStore
): TModelStore {
	const store = useContext(ModelStoreContext);
	if (!store) throw new Error("Missing ModelStore.Provider in the tree");

	return useStore(store, selector || ((s) => s));
}

export { ModelStoreProvider, useModelStore };
export default useModelStore