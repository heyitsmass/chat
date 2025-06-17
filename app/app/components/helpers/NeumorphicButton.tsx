import { useId } from "react";
import { twMerge } from "tailwind-merge";
import { Merge, SetRequired } from "type-fest";
import { DetailedButtonProps } from "./Dropdown";

export type NeumorphicButtonProps = Merge<
	SetRequired<
		Omit<
			DetailedButtonProps,
			"id" | `aria-${"label" | "labelledby" | "hidden" | "describedby"}`
		>,
		"title"
	>,
	{
		icon?: boolean;
	}
>;

export default function NeumorphicButton({
	children,
	className,
	title,
	icon = false,
	...props
}: NeumorphicButtonProps) {
	const id = useId();

	return (
		<button
			id={`${id}-${title}`}
			className={twMerge("neumorphic-button", className, icon && "icon")}
			aria-label={title}
			aria-labelledby={`${id}-${title}`}
			aria-hidden={false}
			aria-describedby={`${id}-${title}`}
			{...props}
		>
			<label htmlFor={`${id}-${title}`} hidden>
				{title}
			</label>
			{children}
		</button>
	);
}
