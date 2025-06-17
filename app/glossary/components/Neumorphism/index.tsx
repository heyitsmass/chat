"use client";

import Preview from "./Preview";
import Configuration from "./Configuration";
import { useRef, useState } from "react";
import { Container, FlexCustom } from "./styles";
import "./styles.css";

export default function Neumorphism() {
	const [activeLightSource, setActiveLightSource] = useState<number>(1);
	const previewBox = useRef<HTMLDivElement>(null);

	return (
		<Container className="neuomorphic mx-auto">
			<FlexCustom className="mx-auto">
				<Preview
					setActiveLightSource={setActiveLightSource}
					previewBox={previewBox}
				/>
				<Configuration
					previewBox={previewBox}
					activeLightSource={activeLightSource}
				/>
			</FlexCustom>
		</Container>
	);
}
