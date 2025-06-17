import { SVGProps } from "react";

export default function Sapphire({
	height = 22,
	width = 22,
	...props
}: Omit<SVGProps<SVGSVGElement>, "viewBox" | "xmlns">) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 423.83 424.94"
			height={height}
			width={width}
			{...props}
		>
			<g>
				<path
					d="M15,293.75v-160.88L131.75,15h160.88l116.19,117.87v160.88l-116.19,116.19h-160.88L15,293.75ZM253.07,314.42l60.24-60.24v-82.15l-60.64-61.51h-81.08l-61.06,61.65v81.88l60.66,60.37h81.88ZM15,132.87l95.52,39.3M171.59,110.52L131.75,15M252.67,110.52l39.97-95.52M313.3,172.04l95.52-39.17M408.83,293.75l-95.52-39.57M253.07,314.42l39.57,95.52M171.18,314.42l-39.43,95.52M15,293.75l95.52-39.7"
					style={{
						fill: "none",
						stroke: "currentcolor",
						strokeMiterlimit: 10,
						strokeWidth: "30px",
					}}
				/>
			</g>
		</svg>
	);
}
