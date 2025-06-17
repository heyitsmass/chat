"use client";
import {
	CheckCircle,
	Info,
	MessageCircle,
	TriangleAlert,
	XCircle,
} from "lucide-react";

import _ from "lodash";

import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import Loader from "../Loader";
type ButtonBaseProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

const buttonTypes = [
	"success",
	"info",
	"warning",
	"danger",
	"primary",
	"secondary",
	"red",
	"orange",
	"yellow",
	"green",
	"blue",
	"indigo",
	"violet",
	"plain",
] as const;

const buttonConfigs = {
	success: {
		color: "border-emerald-600 not-disabled:hover:shadow-emerald-600/20",
		solid: "bg-emerald-700 not-disabled:hover:bg-emerald-600",
		outline:
			"not-hover:text-emerald-400 disabled:text-emerald-400 not-disabled:hover:bg-emerald-700",
	},
	info: {
		color: "border-cyan-600 not-disabled:hover:shadow-cyan-600/20",
		solid: "bg-cyan-700  not-disabled:hover:bg-cyan-600",
		outline:
			"not-hover:text-cyan-400 disabled:text-cyan-400 not-disabled:hover:bg-cyan-700",
	},
	warning: {
		color: "border-amber-600 not-disabled:hover:shadow-amber-600/20",
		solid: "bg-amber-700 not-disabled:hover:bg-amber-600",
		outline:
			"not-hover:text-amber-400 disabled:text-amber-400 not-disabled:hover:bg-amber-700",
	},
	danger: {
		color: "border-rose-600 not-disabled:hover:shadow-rose-600/20",
		solid: "bg-rose-700 not-disabled:hover:bg-rose-600",
		outline:
			"not-hover:text-rose-400 disabled:text-rose-400 not-disabled:hover:bg-rose-700",
	},
	primary: {
		color: "border-indigo-600 not-disabled:hover:shadow-indigo-600/20",
		solid: "bg-indigo-700 not-disabled:hover:bg-indigo-600",
		outline:
			"not-hover:text-indigo-400 disabled:text-indigo-400 not-disabled:hover:bg-indigo-700",
	},
	secondary: {
		color: "border-zinc-400 not-disabled:hover:shadow-zinc-400/20",
		solid: "bg-zinc-500 not-disabled:hover:bg-zinc-400",
		outline:
			"not-hover:text-zinc-300 disabled:text-zinc-300 not-disabled:hover:bg-zinc-500",
	},
	red: {
		color: "border-red-500 not-disabled:hover:shadow-red-500/20",
		solid: "bg-red-600 not-disabled:hover:bg-red-500",
		outline:
			"not-hover:text-red-400 disabled:text-red-400 not-disabled:hover:bg-red-600",
	},
	orange: {
		color: "border-orange-500 not-disabled:hover:shadow-orange-500/20",
		solid: "bg-orange-600 not-disabled:hover:bg-orange-500",
		outline:
			"not-hover:text-orange-400 disabled:text-orange-400 not-disabled:hover:bg-orange-600",
	},
	yellow: {
		color: "border-yellow-500 not-disabled:hover:shadow-yellow-500/20",
		solid: "bg-yellow-600 not-disabled:hover:bg-yellow-500",
		outline:
			"not-hover:text-yellow-400 disabled:text-yellow-400 not-disabled:hover:bg-yellow-600",
	},
	green: {
		color: "border-green-500 not-disabled:hover:shadow-green-500/20",
		solid: "bg-green-600 not-disabled:hover:bg-green-500",
		outline:
			"not-hover:text-green-400 disabled:text-green-400 not-disabled:hover:bg-green-600",
	},
	blue: {
		color: "border-blue-500 not-disabled:hover:shadow-blue-500/20",
		solid: "bg-blue-600 not-disabled:hover:bg-blue-500",
		outline:
			"not-hover:text-blue-400 disabled:text-blue-400 not-disabled:hover:bg-blue-600",
	},
	indigo: {
		color: "border-indigo-500 not-disabled:hover:shadow-indigo-500/20 ",
		solid: "bg-indigo-600 not-disabled:hover:bg-indigo-500",
		outline:
			"not-hover:text-indigo-400 disabled:text-indigo-400 not-disabled:hover:bg-indigo-600",
	},
	violet: {
		color: "border-fuchsia-500 not-disabled:hover:shadow-fuchsia-500/20",
		solid: "bg-fuchsia-600 not-disabled:hover:bg-fuchsia-500",
		outline:
			"not-hover:text-fuchsia-400 disabled:text-fuchsia-400 not-disabled:hover:bg-fuchsia-600",
	},
	plain: {
		color: "text-inherit hover:border-inherit not-disabled:hover:shadow-inherit",
		solid: "bg-inherit not-disabled:hover:bg-inherit",
		outline: "not-hover:text-inherit not-disabled:hover:bg-inherit",
	},
};

interface AsyncButtonProps extends ButtonBaseProps {
	isLoading?: boolean;
	onChange?: <T extends unknown>(value?: T, ...args: unknown[]) => void;
}

/** features we want
 *  * solid / outline
 *  * color
 *  * size 'xs' | 'sm' | 'md' | 'lg' | 'xl' @default {'md'}
 *  ?! icon
 *  ?! tooltip
 *  ?! mobile
 */

const textSizeOptions = {
	xs: "px-3.5 py-0.25 text-xs",
	sm: "px-3.5 py-0.25 text-sm",
	md: "px-4 py-0.5 text-sm",
	lg: "px-6 py-0.5",
	xl: "px-6 py-0.25 text-lg",
};

interface ButtonProps extends AsyncButtonProps {
	color?: (typeof buttonTypes)[number];
	solid?: boolean;
	textColor?: string;
	size?: keyof typeof textSizeOptions;
	icon?: boolean;
	bordered?: boolean;
	background?: boolean;
	shadow?: boolean;
}

const parts = [
	/** base styles */
	"transition-all relative cursor-pointer flex rounded-sm items-center justify-center font-button ",
	/** hover styles */
	"hover:shadow-lg",
	/** disabled styles */
];

const iconStyles = ["aspect-square w-8 h-8 flex items-center justify-center"];

const defaultIcons = {
	success: CheckCircle,
	warning: TriangleAlert,
	danger: XCircle,
	info: Info,
};

const defaultText = {
	success: "Success",
	warning: "Warning",
	danger: "Error",
	info: "Info",
};

const Button = ({
	color = "primary",
	type = "button",
	solid = false,
	textColor = "inherit",
	size = "md",
	icon = false,
	children,
	className,
	disabled,
	isLoading = false,
	bordered = false,
	background = false,
	shadow = false,
	style,
	...props
}: ButtonProps) => {
	const styles = useMemo(() => {
		return _.merge(style || {}, {
			color: textColor !== "inherit" ? textColor : undefined,
		});
	}, [style, textColor]);

	const classes = useMemo(() => {
		return twMerge(
			...parts,
			className,
			buttonConfigs[color].color,
			solid ? buttonConfigs[color].solid : buttonConfigs[color].outline,
			icon ? null : textSizeOptions[size],
			icon ? iconStyles : "pb-1",
			bordered ? "border" : "",
			background ? null : "!hover:bg-transparent !bg-transparent",
			shadow ? null : "!shadow-none hover:!shadow-none"
		);
	}, [color, className, solid, size, icon, bordered, background, shadow]);

	const DefaultIcon = useMemo(() => {
		if (icon && !children) {
			return (
				defaultIcons?.[color as keyof typeof defaultIcons] ||
				MessageCircle
			);
		}
		return null;
	}, [icon, children, color]);

	const text = useMemo(() => {
		if (children) return children;
		return defaultText?.[color as keyof typeof defaultText] || "Button";
	}, [children, color]);

	return (
		<div className="relative w-max z-0">
			{(isLoading || disabled) && (
				<div className="absolute left-0 right-0 bottom-0 top-0 rounded-sm bg-black opacity-30 backdrop-blur z-2 cursor-not-allowed"></div>
			)}
			<button
				type={type}
				disabled={isLoading || disabled}
				className={classes}
				style={styles}
				{...props}
			>
				{isLoading ? (
					<Loader
						isLoading
						className="!w-4 absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 *:!fill-white z-3 !cursor-not-allowed"
					/>
				) : null}
				<div
					className="w-max"
					style={{
						visibility: isLoading ? "hidden" : undefined,
					}}
				>
					{icon ? (
						DefaultIcon ? (
							<DefaultIcon width={20} height={20} />
						) : (
							children
						)
					) : (
						text
					)}
				</div>
			</button>
		</div>
	);
};

const BUTTON_SIZES = Object.keys(
	textSizeOptions
) as (keyof typeof textSizeOptions)[];
const BUTTON_TYPES = Object.keys(
	buttonConfigs
) as (typeof buttonTypes)[number][];
const BUTTON_VARIANTS = ["solid", "outline"] as const;

type ButtonSize = (typeof BUTTON_SIZES)[number];
type ButtonType = (typeof BUTTON_TYPES)[number];
type ButtonVariant = (typeof BUTTON_VARIANTS)[number];

export { Button, BUTTON_SIZES, BUTTON_TYPES, BUTTON_VARIANTS };

export type {
	AsyncButtonProps,
	ButtonBaseProps,
	ButtonProps,
	ButtonSize,
	ButtonType,
	ButtonVariant,
};

export default Button;
