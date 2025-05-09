import { getModels } from "@/app/me/chat/helpers";
import Header from "../Header";
import Chat from "./Chat";

export default function Page() {
	const models = getModels();

	return (
		<div className="grid grid-rows-[auto_1fr_auto] max-h-screen max-w-screen h-screen w-screen overflow-hidden gap-2">
			<Header />
			<main className="flex row-start-2 items-center sm:items-start h-full">
				<Chat models={models} />
			</main>
			<footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center h-12 border-t rounded-bl-lg rounded-br-lg"></footer>
		</div>
	);
}
