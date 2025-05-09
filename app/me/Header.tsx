"use client";

import Image from "next/image";
import { useUser } from "../hooks/useUser";
export default function Header() {
	const [, profile, , loading, usage] = useUser();

	return (
		<header className="row-start-1 h-16 border-b rounded-tl-lg rounded-tr-lg flex justify-end px-6 pl-2">
			<div className="flex items-center">
				<div className="h-14 w-18 relative">
					<Image src="/logo.svg" alt="logo" fill />
				</div>
				<h1>MassChat</h1>
			</div>

			<div className="w-full"></div>
			{!loading && (
				<>
					<div className="w-max">
						<div className="flex flex-col">
							<p className="min-w-max">
								Usage: {usage} / {profile.token_limit} tokens
							</p>
						</div>
					</div>
					<div className="flex gap-2 items-center">
						<div className="text-end">
							<p>{profile.username}</p>
							<p className="text-xs">{profile.plan}</p>
						</div>
						<div className="border border-solid w-9 h-9 rounded-full"></div>
					</div>
				</>
			)}
		</header>
	);
}
