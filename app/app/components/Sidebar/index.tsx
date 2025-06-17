"use client";
import useClientOnly from "@/app/app/hooks/useClientOnly";
import { twMerge } from "@/app/utils";
import { Conversation } from "@/app/utils/types";
import {
	EllipsisVertical,
	ListRestart,
	Pencil,
	Pin,
	PinOff,
	Trash2,
} from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useChatStore } from "../../hooks/useChatStore";
import { Button } from "../helpers/Button";
import UserProfile from "./UserProfile";

function RecentConversation(conversation: Conversation) {
	const id = useId();
	const ref = useRef<HTMLDivElement>(null);
	const [isHovered, setIsHovered] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const isClient = useClientOnly();

	function onOutsideClick(event: MouseEvent) {
		if (!ref.current) return;

		if (!(event.target as HTMLElement).closest(`#${id}`)) {
			setIsOpen(false);
			window.removeEventListener("click", onOutsideClick);
		}
	}

	function onMenuOpen() {
		setIsOpen((prev) => !prev);
		window.addEventListener("click", onOutsideClick);
	}

	function onButtonClick(
		which?: "view" | "pin" | "unpin" | "rename" | "delete"
	) {
		setIsOpen(false);
		setIsHovered(false);
		window.removeEventListener("click", onOutsideClick);
	}

	if (!isClient) return;
	return (
		<div
			id={id}
			className={twMerge(
				"relative flex justify-between h-10 px-2 overflow-ellipsis hover:border items-center text-sm rounded hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400 hover:neumorphism-sm cursor-pointer"
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			ref={ref}
		>
			<p className={isHovered || isOpen ? "!text-zinc-50" : ""}>
				{conversation.title}
			</p>
			<div
				className="h-6 w-6 flex items-center justify-center"
				onClick={onMenuOpen}
			>
				{(isHovered || isOpen) && (
					<EllipsisVertical
						width={20}
						height={30}
						className="hover:text-zinc-50 hover:bg-zinc-800 border-zinc-700 border rounded"
					/>
				)}
				{isOpen && (
					<div
						className={twMerge(
							"z-1 px-1 py-2 space-y-1 top-full right-0 absolute w-max flex flex-col border rounded bg-zinc-800 border-zinc-700 shadow-lg items-start",
							"*:not-[hr]:w-full *:not-[hr]:px-4 *:not-[hr]:rounded *:not-[hr]:cursor-pointer *:not-[hr]:py-1 *:not-[hr]:border *:not-[hr]:border-transparent *:not-[hr]:flex *:not-[hr]:items-center *:not-[hr]:gap-1 *:not-[hr]:hover:border-zinc-600 *:not-[hr]:hover:bg-zinc-700",
							"*:not-[svg]:hover:text-zinc-50"
						)}
					>
						<button type="button" onClick={() => onButtonClick()}>
							<ListRestart
								width={15}
								className="text-emerald-400"
							/>
							<p>View</p>
						</button>
						<button type="button" onClick={() => onButtonClick()}>
							{conversation.pinned ? (
								<PinOff width={15} className="text-amber-400" />
							) : (
								<Pin width={15} className="text-amber-400" />
							)}
							<p>{conversation.pinned ? "Unpin" : "Pin"}</p>
						</button>
						<hr className="border block w-[calc(100%-8px)] self-center border-b-0 border-zinc-600"></hr>
						<button type="button" onClick={() => onButtonClick()}>
							<Pencil
								width={15}
								height={13}
								className="text-teal-400"
							/>
							<p>Rename</p>
						</button>
						<button type="button" onClick={() => onButtonClick()}>
							<Trash2 width={15} className="text-rose-400" />
							<p>Delete</p>
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

type StateHandler<S> = (prev: S | ((prev: S) => S)) => void;

const SidebarContext = React.createContext<{
	isOpen: boolean;
	setIsOpen: StateHandler<boolean>;
	ref: React.RefObject<HTMLElement> | null;
}>({
	isOpen: false,
	setIsOpen: () => {},
	ref: null,
});

const useSidebar = () => {
	const context = React.useContext(SidebarContext);
	if (!context) {
		throw new Error("useSidebar must be used within a SidebarProvider");
	}
	return context;
};

const SidebarToggle = ({ size = 20 }: { size?: number }) => {
	const { isOpen, setIsOpen, ref } = useSidebar();
	const [isHovered, setIsHovered] = useState(false);
	const toggleSidebar = useCallback(() => {
		setIsOpen((prev) => !prev);
	}, [setIsOpen]);

	useEffect(() => {
		if (!ref || !ref.current) return;
		const sidebar = ref.current;
		sidebar.classList.toggle("sidebar-open", isOpen);
	}, [ref, isOpen]);
	return (
		<Button
			icon
			onClick={toggleSidebar}
			className="cursor-pointer relative transition-all duration-300 ease-in-out"
			onMouseOver={() => setIsHovered(true)}
			onMouseOut={() => setIsHovered(false)}
		>
			<div className="grid grid-cols-1 grid-rows-1 place-items-center *:col-span-full *:row-span-full relative *:transition-opacity duration-200">
				<Image
					src="/sidebar_icons/sidebar-opened-thick.svg"
					alt="Sidebar"
					width={size}
					height={size}
					className={twMerge(
						isOpen && !isHovered ? "opacity-100" : "opacity-0"
					)}
				/>
				<Image
					src="/sidebar_icons/sidebar-closed-thick.svg"
					alt="Sidebar"
					width={size}
					height={size}
					className={twMerge(
						!isOpen && !isHovered ? "opacity-100" : "opacity-0"
					)}
				/>
				<Image
					src="/sidebar_icons/sidebar-close-thick.svg"
					alt="Sidebar"
					width={size}
					height={size}
					className={twMerge(
						isHovered && isOpen ? "opacity-100" : "opacity-0"
					)}
				/>
				<Image
					src="/sidebar_icons/sidebar-open-thick.svg"
					alt="Sidebar"
					width={size}
					height={size}
					className={twMerge(
						isHovered && !isOpen ? "opacity-100" : "opacity-0"
					)}
				/>
			</div>
		</Button>
	);
};

const Header = React.memo(() => {
	return (
		<header className="h-24 rounded-tl-lg px-2 pt-3">
			<SidebarToggle />
		</header>
	);
});

const Body = React.memo(() => {
	return <section className="h-full"></section>;
});

const Footer = React.memo(() => {
	const { signedIn, profile } = useChatStore();
	const { isOpen } = useSidebar();

	return (
		<footer
			className={twMerge(
				"h-24 rounded-bl-lg w-full",
				isOpen ? "w-72" : "w-12"
			)}
		>
			<UserProfile
				signedIn={signedIn}
				isCollapsed={!isOpen}
				user={profile}
			/>
		</footer>
	);
});

export default function Sidebar() {
	const { user, conversations } = useChatStore();
	const sidebarRef = useRef<HTMLElement>(null);
	useEffect(() => {
		console.debug(user.id, conversations);
	}, []);
	const [isOpen, setIsOpen] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const isClient = useClientOnly();
	return (
		<SidebarContext.Provider
			value={{
				isOpen,
				setIsOpen,
				ref: sidebarRef as React.RefObject<HTMLElement>,
			}}
		>
			<aside
				id="sidebar"
				className="overflow-hidden divide-zinc-800"
				onMouseLeave={() => setIsHovered(false)}
				ref={sidebarRef}
			>
				{isClient && (
					<>
						<Sidebar.Header />
						<Sidebar.Body />
						<Sidebar.Footer />
					</>
				)}
			</aside>
		</SidebarContext.Provider>
	);
}
Sidebar.Header = Header;
Sidebar.Toggle = SidebarToggle;
Sidebar.Body = Body;
Sidebar.Footer = Footer;
