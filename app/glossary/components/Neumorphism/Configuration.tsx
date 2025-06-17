import React, { useEffect, useRef, useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/prism/css";
import {
  atomDark as Dark,
  prism as Light,
} from "react-syntax-highlighter/dist/esm/styles/prism/";
import ConfigurationRow from "./ConfigurationRow";
import ShapeSwitcher from "./ShapeSwitcher";
import {
  ConfigurationContainer,
  Row,
  Label,
  ColorInput,
  TextInput,
  ResetButton,
  CodeBlock,
  CopyButton,
  HiddenTextarea,
} from "./styles";
import { ConfigurationProps } from "./types";
import {
  colorLuminance,
  getColorFromRoute,
  getContrast,
  getSizes,
  isValidColor,
} from "./utils";

SyntaxHighlighter.registerLanguage("css", css);

const Configuration: React.FC<ConfigurationProps> = ({ previewBox, activeLightSource = 1 }) => {
  const [blur, setBlur] = useState<number>(60);
  const defaultColor = "#e0e0e0";
  const [color, setColor] = useState<string>(getColorFromRoute() || defaultColor);
  const [size, setSize] = useState<number>(300);
  const [radius, setRadius] = useState<number>(50);
  const [shape, setShape] = useState<number>(0);
  const [distance, setDistance] = useState<number>(20);
  const [colorDifference, setColorDifference] = useState<number>(0.15);
  const [maxSize, setMaxSize] = useState<number>(410);
  const [maxRadius, setMaxRadius] = useState<number>(150);
  const [gradient, setGradient] = useState<boolean>(false);
  const [codeString, setCodeString] = useState<string>("");
  
  const codeContainer = useRef<HTMLTextAreaElement>(null);
  const code = useRef<HTMLDivElement>(null);
  const colorInput = useRef<HTMLInputElement>(null);
  const theme = useRef<boolean>(false);

  const colorOnChange = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    if (isValidColor(value)) {
      setColor(value);
    }
  };

  const handleColor = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };

  const copyToClipboard = () => {
    const el = codeContainer.current;
    if (el && code.current) {
      el.select();
      el.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(codeString);
      code.current.classList.add("copied");

      setTimeout(() => {
        if (code.current) {
          code.current.classList.remove("copied");
        }
      }, 1000);
    }
  };

  const handleDistance = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(value);
    setDistance(numValue);
    setBlur(numValue * 2);
  };

  const handleSize = ({ target: { value } }: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = Number(value);
    setSize(numValue);
    setDistance(Math.round(numValue * 0.1));
    setBlur(Math.round(numValue * 0.2));
    setMaxRadius(Math.round(numValue / 2));
  };

  const handleShape = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.target as HTMLButtonElement;
    const shapeData = target.dataset.shape;
    if (shapeData) {
      const shapeId = parseInt(shapeData);
      setShape(shapeId);
      if (shapeId === 2 || shapeId === 3) {
        setGradient(true);
      } else {
        setGradient(false);
      }
    }
  };

  useEffect(() => {
    const { maxSize, size } = getSizes();
    setMaxSize(maxSize);
    setSize(size);
  }, []);

  useEffect(() => {
    if (!isValidColor(color)) {
      return;
    }
    
    let angle: number, positionX: number, positionY: number;
    const darkColor = colorLuminance(color, colorDifference * -1);
    const lightColor = colorLuminance(color, colorDifference);

    const firstGradientColor =
      gradient && shape !== 1
        ? colorLuminance(color, shape === 3 ? 0.07 : -0.1)
        : color;
    const secondGradientColor =
      gradient && shape !== 1
        ? colorLuminance(color, shape === 2 ? 0.07 : -0.1)
        : color;

    // TODO: replace with a map
    switch (activeLightSource) {
      case 1:
        positionX = distance;
        positionY = distance;
        angle = 145;
        break;
      case 2:
        positionX = distance * -1;
        positionY = distance;
        angle = 225;
        break;
      case 3:
        positionX = distance * -1;
        positionY = distance * -1;
        angle = 315;
        break;
      case 4:
        positionX = distance;
        positionY = distance * -1;
        angle = 45;
        break;
      default:
        positionX = distance;
        positionY = distance;
        angle = 145;
        break;
    }

    if (colorInput.current) {
      colorInput.current.value = color;
    }

    document.documentElement.style.cssText = `
      --positionX: ${positionX}px;
      --positionXOpposite: ${positionX * -1}px;
      --positionY: ${positionY}px;
      --positionYOpposite: ${positionY * -1}px;
      --angle: ${angle}deg;
      --blur: ${blur}px;
      --textColor: ${getContrast(color)};
      --textColorOpposite: ${color};
      --baseColor: ${color};
      --darkColor: ${darkColor};
      --lightColor: ${lightColor};
      --firstGradientColor: ${firstGradientColor};
      --secondGradientColor: ${secondGradientColor};
      --size: ${size}px;
      --radius: ${radius}px;
    `;
    
    if (previewBox.current) {
      if (shape === 1) {
        previewBox.current.classList.add("pressed");
      } else {
        previewBox.current.classList.remove("pressed");
      }
    }

    if (isValidColor(color)) {
      if (getContrast(color) === "#001f3f") {
        theme.current = true;
      } else {
        theme.current = false;
      }
    }

    const borderRadius =
      parseInt(radius.toString()) === maxRadius ? "50%" : radius + "px";
    const background =
      gradient && shape !== 1
        ? `linear-gradient(${angle}deg, ${firstGradientColor}, ${secondGradientColor})`
        : `${color}`;
    const boxShadowPosition = shape === 1 ? "inset" : "";
    const firstBoxShadow = `${boxShadowPosition} ${positionX}px ${positionY}px ${blur}px ${darkColor}`;
    const secondBoxShadow = `${boxShadowPosition} ${positionX * -1}px ${
      positionY * -1
    }px ${blur}px ${lightColor};`;

    setCodeString(
      `border-radius: ${borderRadius};
background: ${background};
box-shadow: ${firstBoxShadow},
            ${secondBoxShadow}`
    );
  }, [blur, color, size, radius, shape, distance, colorDifference, maxRadius, gradient, activeLightSource, previewBox]);

  return (
    <ConfigurationContainer>
      <Row>
        <Label htmlFor="color" $opacity={0.6}>
          Pick a color
        </Label>
        <ColorInput
          type="color"
          name="color"
          onChange={handleColor}
          placeholder="#ffffff"
          value={color}
          id="color"
        />
        <Label
          htmlFor="colorInput"
          $paddingLeft="10px"
          $opacity={0.6}
        >
          or
        </Label>
        <TextInput
          type="text"
          placeholder="#ffffff"
          name="color"
          id="colorInput"
          ref={colorInput}
          onChange={colorOnChange}
        />
        {color !== defaultColor && (
          <ResetButton
            onClick={() => {
              setColor(defaultColor);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path
                fill="currentColor"
                d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"
              />
            </svg>
            Reset
          </ResetButton>
        )}
      </Row>
      <ConfigurationRow
        label={"Size"}
        type={"range"}
        value={size}
        onChange={handleSize}
        min={"10"}
        max={maxSize}
      />
      <ConfigurationRow
        label={"Radius"}
        type={"range"}
        value={radius}
        onChange={(e) => setRadius(Number(e.target.value))}
        min={"0"}
        max={maxRadius}
      />
      <ConfigurationRow
        label={"Distance"}
        type={"range"}
        value={distance}
        onChange={handleDistance}
        min={"5"}
        max={"50"}
      />
      <ConfigurationRow
        label={"Intensity"}
        type={"range"}
        value={colorDifference}
        onChange={(e) => setColorDifference(Number(e.target.value))}
        min={"0.01"}
        max={"0.6"}
        step={"0.01"}
      />
      <ConfigurationRow
        label={"Blur"}
        type={"range"}
        value={blur}
        onChange={(e) => setBlur(Number(e.target.value))}
        min={"0"}
        max={"100"}
      />
      <ShapeSwitcher shape={shape} setShape={handleShape} />
      <CodeBlock
        className={`code-block ${theme.current ? "" : "small"}`}
        ref={code}
      >
        <CopyButton
          className="copy"
          onClick={copyToClipboard}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              fill="currentColor"
              d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"
            />
          </svg>
          Copy
        </CopyButton>
        <SyntaxHighlighter
          language="css"
          style={theme.current ? Dark : Light}
        >
          {codeString}
        </SyntaxHighlighter>
        <Label htmlFor="code-container" className="hidden">
          hidden
        </Label>
        <HiddenTextarea
          id="code-container"
          ref={codeContainer}
          value={codeString}
          readOnly
        />
      </CodeBlock>
    </ConfigurationContainer>
  );
};

export default Configuration;
