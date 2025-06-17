import { StateStorage } from "zustand/middleware";
import { del, get, set } from "idb-keyval";

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

export default indexDBStorage;
export { indexDBStorage };
