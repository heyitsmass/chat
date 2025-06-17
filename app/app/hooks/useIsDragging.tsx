"use client";
import React, { useEffect, useMemo, useState } from "react";

export type DragEvent =
	| globalThis.MouseEvent
	| React.MouseEvent<any, MouseEvent>;

type UseIsDraggingProps = {
	onDragStart?: (evt: DragEvent) => void;
	onDragMove?: (evt: DragEvent) => void;
	onDragEnd?: (evt: DragEvent) => void;
};

export default function useIsDragging({
	onDragStart,
	onDragMove,
	onDragEnd,
}: UseIsDraggingProps = {}) {
	const [isDragging, setIsDragging] = useState(false);

	const { handleDragMove, handleDragStart, handleDragEnd } = useMemo(() => {
		const handleDragMove = (evt: DragEvent) => {
			window.removeEventListener("mousedown", handleDragStart);
			onDragMove?.(evt);
		};

		const handleDragEnd = (evt: DragEvent) => {
			window.removeEventListener("mousemove", handleDragMove);
			window.removeEventListener("mouseup", handleDragEnd);
			window.removeEventListener("mousedown", handleDragStart);
			onDragEnd?.(evt);
			setIsDragging(false);
		};

		const handleDragStart = (evt: DragEvent) => {
			window.addEventListener("mousemove", handleDragMove);
			window.addEventListener("mouseup", handleDragEnd);
			onDragStart?.(evt);
			setIsDragging(true);
		};
		return { handleDragStart, handleDragEnd, handleDragMove };
	}, [setIsDragging, onDragMove, onDragStart, onDragEnd]);

	useEffect(() => {
		return () => {
			window.removeEventListener("mouseup", handleDragStart);
			window.removeEventListener("mousedown", handleDragMove);
			window.removeEventListener("mousemove", handleDragEnd);
		};
	}, []);

	return [
		isDragging,
		handleDragStart,
		handleDragMove,
		handleDragEnd,
	] as const;
}
