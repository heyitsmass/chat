"use client";
import React, { PropsWithChildren, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Merge, SetRequired } from "type-fest";
import useOnOutsideClick from "../../hooks/useOnOutsideClick";

export type TPosition = "top" | "bottom" | "left" | "right";
export type TDirection = "ascending" | "descending";

const DropdownMenuContext = React.createContext<{
	isOpen: boolean;
	setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
	position: TPosition;
	direction: TDirection;
}>({
	isOpen: false,
	setIsOpen: () => {},
	position: "bottom",
	direction: "ascending",
});

export const useDropdown = () => {
	const context = React.useContext(DropdownMenuContext);
	if (!context) {
		throw new Error(
			"useDropdown must be used within a DropdownMenuProvider"
		);
	}
	return context;
};

const DropdownMenu = ({
	children,
	title,
}: PropsWithChildren<{ title: string }>) => {
	const contentRef = React.useRef<HTMLDivElement>(null);
	const { isOpen, position, direction, setIsOpen } = useDropdown();

	useOnOutsideClick({
		onOutsideClick: () => {
			if (isOpen) {
				setIsOpen(false);
			}
		},
		ref: contentRef,
	});

	return (
		<div
			className={twMerge(
				isOpen ? "open" : "closed",
				position,
				direction,
				"options custom-scrollbar-minimal"
			)}
			ref={contentRef}
		>
			<div className="p-2 grid grid-rows-[auto_1fr] h-full options-content ">
				<div className="text-xs text-gray-400 p-4 py-3 font-medium">
					{title}
				</div>
				<div className="overflow-y-scroll flex flex-col pr-2">
					{children}
				</div>
			</div>
		</div>
	);
};

export type DetailedButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
>;

type DropdownToggleProps = Omit<DetailedButtonProps, "onClick">;
type DropdownItemProps = Merge<
	SetRequired<Omit<DetailedButtonProps, "onClick">, "value">,
	{
		onClick?: (value: string | number | readonly string[]) => void;
		isSelected?: boolean;
	}
>;

function DropdownToggle({ children, ...props }: DropdownToggleProps) {
	const { setIsOpen } = useDropdown();

	return (
		<button onClick={() => setIsOpen((prev) => !prev)} {...props}>
			{children}
		</button>
	);
}

function DropdownItem({
	children,
	value,
	onClick,
	className,
	isSelected,
	...props
}: DropdownItemProps) {
	const { setIsOpen } = useDropdown();

	return (
		<button
			value={value}
			className={twMerge(className, isSelected ? "selected" : "")}
			onClick={() => {
				onClick?.(value);
				setIsOpen(false);
			}}
			{...props}
		>
			{children}
		</button>
	);
}

type TValidCombinations =
	| {
			position: "top";
			direction: "ascending";
	  }
	| {
			position: "bottom";
			direction: "descending";
	  }
	| {
			position: "left" | "right";
			direction: TDirection;
	  };

function Dropdown({
	children,
	position = "bottom",
	direction = "descending",
}: PropsWithChildren<Partial<TValidCombinations>>) {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<DropdownMenuContext.Provider
			value={{ isOpen, setIsOpen, position, direction }}
		>
			<div className="dropdown-wrapper">
				<div className="select">{children}</div>
			</div>
		</DropdownMenuContext.Provider>
	);
}

Dropdown.Toggle = DropdownToggle;
Dropdown.Item = DropdownItem;
Dropdown.Menu = DropdownMenu;

export default Dropdown;
export type { DropdownToggleProps, DropdownItemProps, TValidCombinations };
