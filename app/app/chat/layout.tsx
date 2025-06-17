"use client";
import { PropsWithChildren, useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }: PropsWithChildren) {
	const [isOpen, setIsOpen] = useState(true);
	return (
		<section className="h-full rounded-lg grid grid-cols-[auto_1fr]">
			<Sidebar
				isOpen={isOpen}
				toggleOpen={() => setIsOpen((prev) => !prev)}
			/>
			<section className="rounded-tr-lg rounded-br-lg">
				{children}
			</section>
		</section>
	);
}
