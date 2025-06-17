"use client";
import useClientOnly from "@/app/app/hooks/useClientOnly";
import { Plan, Profile } from "@/app/utils/types";
import { Crown, Diamond, Gem, Plus, Settings, User, Zap } from "lucide-react";
import React, { cache, useMemo } from "react";
import { AiOutlineRuby } from "react-icons/ai";
import { Button } from "../helpers/Button";
const designs = [
	"Logged Out",
	"Silver Plan",
	"Gold Plan",
	"Diamond Plan",
	"Emerald Plan",
	"Anonymous",
] as const;

export type Design = (typeof designs)[number];

export type UserProfileProps = {
	currentUser: Profile;
	isLoggedIn: boolean;
	isAnonymous: boolean;
	design: Design;
};

const planConfig = {
	free: {
		color: "text-gray-400",
		icon: User,
		bgColor: "bg-gray-800 border-gray-600 shadow-gray-500/20",
	},
	silver: {
		color: "text-gray-300",
		icon: Zap,
		bgColor: "bg-gray-700 border-gray-500 shadow-gray-400/20",
	},
	gold: {
		color: "text-yellow-400",
		icon: Crown,
		bgColor: "bg-yellow-900/20 border-yellow-600/60 shadow-yellow-500/20",
	},
	diamond: {
		color: "text-blue-400",
		icon: Diamond,
		bgColor: "bg-blue-900/20 border-blue-700/60 shadow-blue-500/20",
	},
	emerald: {
		color: "text-emerald-400",
		icon: Gem,
		bgColor:
			"bg-emerald-900/20 border-emerald-700/60 shadow-emerald-500/20",
	},
	sapphire: {
		color: "text-sky-400",
		icon: AiOutlineRuby,
		bgColor:
			"bg-sky-900/20 border-sky-700/60 shadow-sky-500/20 text-[1.6rem]",
	},
} as {
	[key in Plan]: {
		color: string;
		icon: React.ComponentType<{ className?: string }>;
		bgColor: string;
	};
};

const getInitials = (name: string | null) => {
	if (!name) return "?";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
};

type TUser = UserProfileProps["currentUser"];

const getTokenPercentage = cache((user: TUser) => {
	if (!user) return 0;

	return Math.min((user.token_usage / user.token_limit) * 100, 100);
});

const getTokenColor = cache((user: TUser) => {
	const percentage = getTokenPercentage(user);
	if (!user) return "bg-gray-800";
	if (percentage >= 100) return "bg-red-700";
	if (percentage >= 90) return "bg-red-500";
	if (percentage >= 70) return "bg-yellow-500";
	return "bg-green-500";
});

const UserProfile = ({
	isCollapsed,
	signedIn = false,
	isAnonymous = false,
	user,
}: {
	isCollapsed: boolean;
	signedIn?: boolean;
	isAnonymous?: boolean;
	user: Profile | null;
}) => {
	const isClient = useClientOnly();

	if (!isClient) return;

	return (
		<div
			className={`max-h-24 h-full transition-all duration-300 ease-in-out ${
				isCollapsed ? "max-w-12" : "max-w-72"
			} w-full bg-zinc-950 p-3 border-gray-800 flex items-center transition-[width] duration-initial`}
		>
			{!signedIn || !user ? (
				<LoggedOutUser isCollapsed={isCollapsed} />
			) : (
				// Logged In State
				<LoggedInUser
					isCollapsed={isCollapsed}
					isAnonymous={isAnonymous}
					{...user}
				/>
			)}
		</div>
	);
};

const LoggedOutUser = ({ isCollapsed, ...usr }: { isCollapsed: boolean }) => {
	return (
		<>
			{isCollapsed ? (
				<div className="w-full flex justify-center">
					<div className="w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center aspect-square">
						<User className="w-4 h-4 text-gray-500" />
					</div>
				</div>
			) : (
				<div className="w-full flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
							<User className="w-5 h-5 text-zinc-500" />
						</div>
						<div className="*:w-max">
							<p className="text-zinc-400 text-sm">
								Not signed in
							</p>
							<p className="text-zinc-500 text-xs">
								Join to get started
							</p>
						</div>
					</div>
					<Button background>Sign Up</Button>
				</div>
			)}
		</>
	);
};

const LoggedInUser = ({
	isCollapsed,
	isAnonymous = false,
	...user
}: { isCollapsed: boolean; isAnonymous?: boolean } & TUser) => {
	return (
		<>
			{isCollapsed ? (
				<div className="w-full flex flex-col items-center space-y-1">
					{/* Profile Picture/Initials */}
					<div className="relative">
						{user.avatar_url ? (
							<img
								src={user.avatar_url}
								alt="Profile"
								className="w-8 h-8 rounded-full object-cover"
							/>
						) : (
							<div
								className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
									planConfig[user.plan].bgColor
								} ${planConfig[user.plan].color}`}
							>
								{isAnonymous ? "?" : getInitials(user.name)}
							</div>
						)}
						{/* Plan indicator dot */}
						<div
							className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-zinc-900 ${
								planConfig[user.plan].bgColor
							}`}
						>
							<div
								className={`w-full h-full rounded-full ${planConfig[
									user.plan
								].color.replace("text-", "bg-")}`}
							/>
						</div>
					</div>
					{/* Token usage indicator */}
					<div className="w-6 h-1 bg-zinc-800 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all ${getTokenColor(
								user
							)}`}
							style={{
								width: `${getTokenPercentage(user)}%`,
							}}
						/>
					</div>
				</div>
			) : (
				<div className="w-full">
					<div className="flex items-center justify-between mb-2">
						<div className="flex items-center space-x-3">
							{/* Profile Picture/Initials */}
							<div className="relative">
								{user.avatar_url ? (
									<img
										src={user.avatar_url}
										alt="Profile"
										className="w-10 h-10 rounded-full object-cover"
									/>
								) : (
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
											planConfig[user.plan].bgColor
										} ${planConfig[user.plan].color}`}
									>
										{isAnonymous
											? "?"
											: getInitials(
													user.name || user.username
											  )}
									</div>
								)}
								{/* Plan badge */}
								<div
									className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border shadow-md ${
										planConfig[user.plan].bgColor
									} flex items-center justify-center`}
								>
									{React.createElement(
										planConfig[user.plan].icon,
										{
											className: `w-2.5 h-2.5 ${
												planConfig[user.plan].color
											}`,
										}
									)}
								</div>
							</div>

							{/* User Info */}
							<div className="flex-1 min-w-0">
								<p className="text-white text-sm font-medium truncate">
									{isAnonymous ? user.username : user.name}
								</p>
								<p className="text-zinc-400 text-xs truncate">
									{isAnonymous
										? "Anonymous User"
										: `@${user.username}`}
								</p>
							</div>
						</div>

						{/* Settings */}
						<button className="p-1.5 hover:bg-zinc-800 rounded-md transition-colors">
							<Settings className="w-4 h-4 text-zinc-400" />
						</button>
					</div>

					{/* Token Usage Bar */}
					<TokenUsageBar {...user} />
				</div>
			)}
		</>
	);
};

const shortenNumber = (num: number) => {
	return num.toLocaleString("en-US", {
		notation: "compact",
		compactDisplay: "short",
	});
};
const TokenUsageBar = ({ ...user }: TUser) => {
	const { color, percentage, usage, limit } = useMemo(() => {
		return {
			color: getTokenColor(user),
			percentage: getTokenPercentage(user),
			usage: shortenNumber(user.token_usage),
			limit: shortenNumber(user.token_limit),
		};
	}, [user.token_usage, user.token_limit]);
	return (
		<div className="space-y-1">
			<div className="flex justify-between items-center">
				<span className="text-xs text-zinc-400">
					{usage} / {limit} tokens
				</span>
				<div className="flex items-center space-x-2">
					{user.plan !== "free" && (
						<button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded text-xs font-medium transition-colors flex items-center space-x-1">
							<Plus className="w-3 h-3" />
							<span>Upgrade</span>
						</button>
					)}
				</div>
			</div>
			<div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
				<div
					className={`h-full transition-all ${color}`}
					style={{
						width: `${percentage}%`,
					}}
				/>
			</div>
		</div>
	);
};

export default UserProfile;
export { designs, planConfig, getInitials, getTokenPercentage, getTokenColor };
