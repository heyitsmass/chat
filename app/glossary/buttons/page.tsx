"use client";

import {
	Button,
	BUTTON_SIZES,
	BUTTON_TYPES,
	ButtonSize,
} from "@/app/app/components/helpers/Button";
import { useState } from "react";
import {
	ExampleButton,
	ExampleIconButton,
	ExampleLoadingButton,
	ExampleTooltipButton,
} from "./components";

export default function Page() {
	const [isLoading, setIsLoading] = useState(false);
	return (
		<section className="h-max flex flex-wrap items-center justify-end gap-4 p-10">
			<ExampleButton />
			<ExampleIconButton />
			<ExampleTooltipButton />
			<ExampleLoadingButton />
			{BUTTON_TYPES.map((type, i) => {
				const index = Math.round(
					Math.random() * (BUTTON_SIZES.length - 1)
				);
				return (
					<Button
						key={type}
						color={type}
						className="w-max justify-self-center"
						size={BUTTON_SIZES[index] as ButtonSize}
						icon
						onClick={() => {
							if (!isLoading) {
								setIsLoading(true);
								setTimeout(() => {
									setIsLoading(false);
								}, 2500);
							}
						}}
						isLoading={isLoading}
					></Button>
				);
			})}
		</section>
	);
}
