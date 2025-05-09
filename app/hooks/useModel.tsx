import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Model } from "../types";

export const useModel = create<
	{ selectedModel: string; models: Model[]; model?: Model } & {
		setSelectedModel: (model: string) => void;
		setModels: (models: Model[]) => void;
	}
>()(
	immer((set) => {
		return {
			selectedModel: "llama-3.3-70b-versatile",
			models: [],
			setModels: (models: Model[]) => {
				set({ models });
			},
			setSelectedModel: (model: string) => {
				set({ selectedModel: model });
				set((state) => {
					state.model = state.models.find((m) => m.id === model);
				});
			},
		};
	})
);
