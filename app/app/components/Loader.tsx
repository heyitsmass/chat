import { DetailedHTMLProps, HTMLAttributes } from "react";

export default function Loader({
	isLoading = false,
	className,
	...props
}: { isLoading?: boolean } & DetailedHTMLProps<
	HTMLAttributes<HTMLDivElement>,
	HTMLDivElement
>) {
	const classes = isLoading ? "m-segment-overlay" : "m-segment";

	return (
		<div className={[className, "m-loader-container"].join(" ")} {...props}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="88.356 47.208 320.532 396.083"
			>
				<g id="object-0">
					<path
						id="m-segment-overlay-1"
						className={classes}
						d="M 153.969 176.244 L 154.195 316.001 L 88.356 361.891 L 88.356 120.531 L 153.969 176.244 Z"
					>
						<title>segment-1</title>
					</path>
					<polygon
						id="m-segment-overlay-3"
						className={classes}
						points="191.541 120.531 147.416 182.608 197.166 329.725 279.099 329.62 194.982 120.531"
					>
						<title>segment-3</title>
					</polygon>
					<polyline
						id="m-segment-overlay-5"
						className={classes}
						points="243.196 241.097 327.584 47.336 327.938 218.177 279.099 329.725"
					>
						<title>segment-5</title>
					</polyline>
					<polygon
						id="m-segment-overlay-4"
						className={classes}
						points="197.744 329.62 243.196 241.135 279.099 329.62"
					>
						<title>segment-4</title>
					</polygon>
					<path
						id="m-segment-overlay-6"
						className={classes}
						d="M 327.52 47.208 L 327.584 385.421 L 399.148 329.62 L 399.148 120.531 L 327.52 47.208 Z"
					>
						<title>segment-6</title>
					</path>
					<polygon
						id="m-segment-overlay-7"
						className={classes}
						points="327.584 385.356 380.561 343.36 408.888 443.291"
					>
						<title>segment-7</title>
					</polygon>
					<polygon
						id="m-segment-overlay-2"
						className={classes}
						points="147.376 182.608 194.268 120.531 88.356 120.531"
					>
						<title>segment-2</title>
					</polygon>
				</g>
			</svg>
		</div>
	);
}
