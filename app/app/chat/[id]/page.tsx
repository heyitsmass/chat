"use client";

import { redirect, RedirectType, useParams } from "next/navigation";
import AuthenticatedChat from "./components/AuthenticatedChat";
import UnauthenticatedChat from "./components/UnauthenticatedChat";
import { useChatStore } from "../../hooks/useChatStore";
import { useMemo } from "react";

export default function Page() {
	const { id } = useParams();

	const { signedIn, getConversation } = useChatStore<true>();

	const conversation = useMemo(() => getConversation(id as string), [id]);

	if (!conversation) redirect("/app", RedirectType.replace);

	if (signedIn) return <AuthenticatedChat />;
	return <UnauthenticatedChat />;
}
