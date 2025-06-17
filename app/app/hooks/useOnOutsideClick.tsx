"use client";

import { RefObject, useCallback, useEffect } from "react";

export default function useOnOutsideClick<T extends HTMLElement>({
	onOutsideClick = () => {},
	ref,
}: {
	onOutsideClick?: () => void;
	ref: RefObject<T | null>;
}) {
	const handleClickOutside = useCallback(
		(event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				onOutsideClick();
			}
		},
		[ref, onOutsideClick]
	);

	useEffect(() => {
		if (!ref.current) return;
		document.addEventListener("click", handleClickOutside);
		return () => {
			document.removeEventListener("click", handleClickOutside);
		};
	}, [handleClickOutside]);
}
