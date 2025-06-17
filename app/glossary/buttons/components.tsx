"use client";
import { useState } from "react";
import { Button } from "../../app/components/helpers/Button";
import Tooltip from "../../app/components/Tooltip";

const ExampleTooltipButton = () => {
	return (
		<Tooltip>
			<Button
				color="primary"
				className="w-max justify-self-center"
				size="sm"
				onClick={() => {}}
				icon
			/>
			<Tooltip.Content position="bottom">
				Click me to see the tooltip! This is a tooltip that can be used
			</Tooltip.Content>
		</Tooltip>
	);
};

const ExampleIconButton = () => {
	return (
		<Button
			color="primary"
			className="w-max justify-self-center"
			size="sm"
			onClick={() => {}}
			icon
		/>
	);
};

const ExampleButton = () => {
	return (
		<Button
			color="primary"
			className="w-max justify-self-center"
			size="md"
			onClick={() => {}}
		>
			Click Me
		</Button>
	);
};

const ExampleLoadingButton = () => {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<Button
			color="primary"
			className="w-max justify-self-center"
			size="lg"
			onClick={() => {
				if (!isLoading) {
					setIsLoading(true);
					setTimeout(() => {
						setIsLoading(false);
					}, 2500);
				}
			}}
			isLoading={isLoading}
		>
			Click Me
		</Button>
	);
};

export {
	ExampleButton,
	ExampleIconButton,
	ExampleTooltipButton,
	ExampleLoadingButton,
};
