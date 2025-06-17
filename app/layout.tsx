"use server";
import StyledComponentsRegistry from "@/lib/registry";
import Sidebar from "./app/components/Sidebar";
import { ChatStoreProvider } from "./app/hooks/useChatStore";
import { ConversationStoreProvider } from "./app/hooks/useConversationStore";
import { ModelStoreProvider } from "./app/hooks/useModelStore";
import "./globals.css";
import * as fonts from "./utils/fonts";
import { getModels } from "./utils/helpers";
import metadata from "./utils/metadata";
import { getUser } from "./utils/user";

import { ChatInputStoreProvider } from "./app/hooks/useChatInput";

const className = Object.values(fonts)
	.map((value) => value.variable)
	.join(" ");

export async function generateMetadata(props: unknown) {
	return metadata;
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { data: models } = await getModels();
	const data = await getUser();

	return (
		<html lang="en" className={className}>
			<body className="z-0">
				<StyledComponentsRegistry>
					<ChatStoreProvider {...data}>
						<ChatInputStoreProvider models={models}>
							<ConversationStoreProvider
								conversations={data.conversations}
							>
								<Sidebar />
								<section className="border flex overflow-visible rounded-lg m-4 ml-0 border-zinc-800/20 shadow shadow-zinc-200/10 bg-zinc-900 z-2">
									{children}
								</section>
							</ConversationStoreProvider>
						</ChatInputStoreProvider>
					</ChatStoreProvider>
				</StyledComponentsRegistry>
			</body>
		</html>
	);
}
