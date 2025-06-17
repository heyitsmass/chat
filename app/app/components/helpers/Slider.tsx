"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import useClientOnly from "../../hooks/useClientOnly";
import useIsDragging, { DragEvent } from "../../hooks/useIsDragging";
import ToolTip from "./Tooltip";

export interface IRange {
	value: number;
	label: string;
	description?: string;
}

export interface ISlider {
	id: string;
	label: string;
	description?: string;
	precision: number;
	range: {
		defaultValue: number;
		min: IRange;
		max: IRange;
		steps?: IRange[];
		step: number;
	};
}
export interface ISliderOptions {
	/** If the slider should be rounded or not @default true */
	rounded?: boolean;
	/** If the limit should be padded inward @default 0 */
	innerPadding?: number;
	/** If the increment ticks should be shown @default true */
	showTicks?: boolean;
	/** If the increment ticks should be staggered in length or even @default true  */
	staggeredTicks?: boolean;
	/** If the increment ticks should be staggered on even or odd index @default false */
	evenStagger?: boolean;
	/** How precise the number should be @default 2 */
	precision?: number;
	onChange: (newValue: number, progress: number, key?: string) => void;
	value: number;
}

const round = (value: number, precision: number = 2) => {
	return (
		Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
	);
};

const bind = (value: number, min: number = 0, max: number = 1) => {
	return Math.max(min, Math.min(max, value));
};

const calculatePosition = (clientX: number, width: number, offset: number) => {
	return bind(clientX - offset, 0, width);
};

const calculatePositionFromProgress = (progress: number, width: number) => {
	return width * progress;
};

export type SliderProps = ISlider & ISliderOptions;

export function Slider({
	rounded = true,
	precision = 2,
	value,
	range: { defaultValue, ...range },
	onChange,
	...slider
}: SliderProps) {
	const ref = useRef<HTMLDivElement>(null);
	const isDisabled = false;

	const { min, max, step } = useMemo(() => {
		const {
			min: { value: minValue },
			max: { value: maxValue },
			step,
		} = range;

		return {
			min: minValue,
			max: maxValue,
			step,
		};
	}, [range]);

	const [thumbPos, setThumbPos] = useState(0);
	const [sliderProgress, setSliderProgress] = useState(value || defaultValue);

	const thumbRef = useRef<HTMLDivElement>(null);

	const isClient = useClientOnly();

	const currentOffset = useMemo(() => {
		if (!isClient || !ref.current) return 0;
		const { offsetLeft, parentElement } = ref.current;
		let offset = offsetLeft;
		if (parentElement) {
			offset += parentElement.offsetLeft;
		}
		return offset;
	}, [isClient]);

	useEffect(() => {
		if (isClient && ref.current) {
			setThumbPos(
				calculatePositionFromProgress(
					sliderProgress,
					ref.current.clientWidth
				)
			);
		}
	}, [isClient, currentOffset]);

	const onDragMove = (event: DragEvent) => {
		if (!ref.current) return;

		const { clientWidth } = ref.current;

		const position = calculatePosition(
			event.clientX,
			clientWidth,
			currentOffset
		);

		const progress = bind(position / clientWidth);

		setThumbPos(position);
		setSliderProgress(round(progress, precision));
		onChange(round((max - min) * progress, precision), progress);
	};

	const [isDragging, handleDragStart, handleDragEnd] = useIsDragging({
		onDragMove,
	});

	const stepCount = useMemo(() => {
		let stepCount = (range.steps?.length || 1) + 2;
		if (stepCount % 2) stepCount += 1;
		return stepCount;
	}, [range]);

	const steps = useMemo(() => {
		if (!isClient || !ref.current) return null;

		const { clientWidth } = ref.current;

		const offset = clientWidth / stepCount;

		return Array.from({ length: stepCount + 1 }).map((_, i) => {
			let value: string | number | undefined =
				((max - min) / stepCount) * i;

			const label =
				i == 0
					? range.min.label
					: i == stepCount
					? range.max.label
					: range.steps?.find((v) => v.value === value)?.label ||
					  value;

			return (
				<div
					className={[
						"absolute top-1/2 -translate-y-1/2 w-[1px] bg-indigo-400 flex justify-center z-1",
						i % 2 ? "h-6" : "h-4",
					].join(" ")}
					key={i}
					style={{
						left: `${offset * i}px`,
					}}
				>
					<div
						className={[
							"relative w-max text-xs flex items-end select-none  text-zinc-400",
							i % 2 ? "h-10" : "h-9",
						].join(" ")}
					>
						<p>{label}</p>
					</div>
				</div>
			);
		});
	}, [isClient]);

	const handleClickToSetProgress = (event: DragEvent) => {
		if (!ref.current) return;
		event.stopPropagation();

		onDragMove(event);
	};
	return (
		<div className="grid grid-rows-[1fr_auto]">
			<header className="pl-2 text-xs font-semibold font-heading tracking-wide text-zinc-400 flex items-center gap-2">
				<p>{slider.label}</p>
				{slider.description && <ToolTip>{slider.description}</ToolTip>}
			</header>
			<div
				className={[
					"px-2 relative h-12 flex z-0 py-4 pt-3",
					isDisabled &&
						"opacity-50 pointer-default pointer-events-none",
				].join(" ")}
			>
				<input
					type="range"
					hidden
					min={min}
					max={max}
					defaultValue={value}
					step={step}
				/>
				<div
					className={[
						"border h-2 w-full relative border-indigo-900 bg-indigo-100",
						rounded && "rounded-full",
					].join(" ")}
					onClick={handleClickToSetProgress}
					ref={ref}
				>
					<div
						className={[
							"z-3 absolute top-1/2 bottom-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col justify-center",
							isDragging ? "cursor-grabbing" : "cursor-grab",
						].join(" ")}
						onMouseDown={handleDragStart}
						onMouseUp={handleDragEnd}
						ref={thumbRef}
						style={{
							width: "1rem",
							height: "1rem",
							background: "var(--color-indigo-100)",
							borderRadius: "100%",
							left: `${thumbPos}px`,
						}}
					>
						{isDragging && (
							<div className="absolute left-1/2 -translate-x-1/2 top-6  border z-0 rounded-md bg-zinc-600 border-zinc-700 flex items-center justify-center select-none">
								<div
									id="tooltip"
									className="relative text-xs w-max htop-1 px-2 py-0.5 bg-transparent"
								>
									<div className="absolute border-5 translate-x-1/2 right-1/2 -top-1 z-1 border-t-0 border-l-transparent border-r-transparent border-b-zinc-600"></div>

									{value}
								</div>
							</div>
						)}
					</div>
					<div
						className="absolute left-0 top-0 bottom-0 -z-0 bg-indigo-600 rounded-full"
						onClick={handleClickToSetProgress}
						style={{
							width: `${
								sliderProgress * (ref.current?.clientWidth || 0)
							}px`,
						}}
					></div>

					{steps}
				</div>
			</div>
		</div>
	);
}

export default Slider;
