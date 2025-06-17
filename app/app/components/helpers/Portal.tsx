import { ReactNode, useId, useMemo } from "react";
import { createPortal } from "react-dom";

export default function Portal({
	isOpen,
	...props
}: {
	children: ReactNode;
	isOpen: boolean;
}) {
	const id = useId();

	const portal = useMemo(() => {
		return createPortal(
			props.children,
			document.body.firstElementChild!,
			`modal/${id}`
		);
	}, [props.children, id]);

	if (isOpen) return portal;
}
