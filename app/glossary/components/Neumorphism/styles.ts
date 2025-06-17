import styled, { css } from "styled-components";
import { LightSourceProps } from "./types";

// Helper function for conditional border radius
const getBorderRadius = (props: LightSourceProps) => {
  const { $right, $bottom, $left, $top } = props;
  
  if ($right === "unset" && $bottom === "unset") return "0 0 30px 0";
  if ($left === "unset" && $bottom === "unset") return "0 0 0 30px";
  if ($right === "unset" && $top === "unset") return "30px 0 0 0";
  if ($left === "unset" && $top === "unset") return "0 30px 0 0";
  
  return "0";
};

export const LightSource = styled.div<LightSourceProps>`
  position: absolute;
  left: ${props => props.$left};
  top: ${props => props.$top};
  right: ${props => props.$right};
  bottom: ${props => props.$bottom};
  background: transparent;
  height: 30px;
  width: 30px;
  cursor: pointer;
  border: 2px solid var(--textColor);
  opacity: 0.8;
  border-radius: ${getBorderRadius};
  transition: all 0.2s ease;

  &.active {
    background: #ffff00;
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`;

export const Container = styled.div`
  width: 100%;
  text-align: center;
  margin-bottom: 20px;

  @media only screen and (min-height: 800px) {
    margin-bottom: 70px;
  }
`;

export const FlexCustom = styled.div`
  display: inline-flex;
  margin-inline: auto;
  align-items: flex-start;

  @media only screen and (max-width: 680px) {
    flex-direction: column;
    align-items: center;
  }
`;

export const PreviewContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 500px;
  height: 500px;
  margin-right: 50px;

  @media only screen and (max-width: 1000px),
    only screen and (max-height: 713px) {
    width: 400px;
    height: 400px;
    margin-right: 30px;
  }

  @media only screen and (max-width: 800px) {
    width: 300px;
    height: 300px;
    margin-right: 20px;
  }

  @media only screen and (max-width: 680px) {
    width: 100%;
    height: 200px;
    margin-right: 0px;
    margin-bottom: 30px;
    z-index: 1;
  }

  @media only screen and (max-height: 735px) {
    margin-bottom: 20px;
  }

  @media only screen and (max-height: 720px) {
    margin-bottom: 0px;
  }
`;

export const SoftElement = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: var(--size);
  height: var(--size);
  border-radius: var(--radius);
`;

export const SoftShadow = styled(SoftElement)`
  background: linear-gradient(
    var(--angle),
    var(--firstGradientColor),
    var(--secondGradientColor)
  );
  box-shadow: var(--positionX) var(--positionY) var(--blur) var(--darkColor),
    var(--positionXOpposite) var(--positionYOpposite) var(--blur)
      var(--lightColor);

  &.pressed {
    box-shadow: inset var(--positionX) var(--positionY) var(--blur)
        var(--darkColor),
      inset var(--positionXOpposite) var(--positionYOpposite) var(--blur)
        var(--lightColor);
  }
`;

export const ConfigurationContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 30px;
  border-radius: 30px;
  text-align: left;
  position: relative;
  background: linear-gradient(
    var(--angle),
    var(--firstGradientColor),
    var(--secondGradientColor)
  );
  box-shadow: var(--positionX) var(--positionY) var(--blur) var(--darkColor),
    var(--positionXOpposite) var(--positionYOpposite) var(--blur)
      var(--lightColor);

  @media only screen and (min-width: 1700px) {
    font-size: 16px;
  }

  @media only screen and (max-width: 950px) {
    font-size: 12px;
  }

  @media only screen and (max-width: 680px) {
    font-size: 11px;
    padding: 15px;
    border-radius: 15px;
    box-shadow: none;
    background: var(--baseColor);
  }
`;

export const Row = styled.div<{ $isLabel?: boolean }>`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--textColor);
  margin-bottom: ${props => props.$isLabel ? '10px' : '20px'};
  margin-top: 0px;

  @media only screen and (max-width: 680px) and (max-height: 715px),
    screen and (max-height: 720px) {
    margin-bottom: ${props => props.$isLabel ? '5px' : '10px'};
  }

  @media only screen and (max-width: 680px) and (max-height: 650px),
    screen and (max-height: 600px) {
    margin-bottom: 5px;
  }
`;

export const Label = styled.label<{ $opacity?: number; $paddingLeft?: string }>`
  padding-right: 10px;
  user-select: none;
  opacity: ${props => props.$opacity || 1};
  padding-left: ${props => props.$paddingLeft || '0'};

  @media only screen and (max-width: 950px) {
    padding-right: 6px;
  }
`;

export const ColorInput = styled.input`
  -webkit-appearance: none;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  padding: 0;
  border: 3px solid var(--textColor);

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }

  &::-webkit-color-swatch {
    border: none;
  }
`;

export const TextInput = styled.input`
  border: 3px solid var(--textColor);
  color: #001f3f;
  padding: 0px 5px;
  font-size: 15px;
  font-weight: bold;
  height: 32px;
  width: 85px;
  display: inline-block;
`;

export const ResetButton = styled.button`
  height: 32px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  margin-left: 12px;
  font-size: 12px;
  color: var(--textColor);
  border: 3px solid var(--textColor);
  background: var(--baseColor);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.8;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const RangeInput = styled.input`
  -webkit-appearance: none;
  margin: 10px 0;
  height: 0;
  width: 100%;
  background-color: transparent;
  position: relative;

  @media only screen and (max-width: 410px) {
    position: unset;
  }

  &:focus {
    outline: none;
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    background: var(--textColor);
    border-radius: 3px;
  }

  &::-webkit-slider-thumb {
    box-shadow: 1px 1px 1px #30302f, 0px 0px 1px #30302f;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: var(--textColor);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -5px;
  }

  &::-moz-range-thumb {
    box-shadow: 1px 1px 1px #30302f, 0px 0px 1px #30302f;
    border: 1px solid #000000;
    height: 16px;
    width: 16px;
    border-radius: 50%;
    background: var(--textColor);
    cursor: pointer;
  }

  &::-moz-range-track {
    width: 100%;
    height: 6px;
    cursor: pointer;
    background: var(--textColor);
    border-radius: 1.3px;
  }

  &:hover,
  &:active,
  &:focus,
  &:focus-within {
    &::after {
      content: attr(value) "px";
      position: absolute;
      left: 105%;
      top: 50%;
      transform: translateY(-50%);
      color: var(--textColorOpposite);
      border-radius: 3px;
      padding: 10px;
      background: var(--textColor);

      @media only screen and (max-width: 410px) {
        right: 15px;
        top: 15px;
        left: unset;
        transform: unset;
      }
    }

    &::before {
      width: 0;
      height: 0;
      border-right: 15px solid var(--textColor);
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      z-index: 222;
      content: " ";
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 103%;

      @media only screen and (max-width: 410px) {
        display: none;
      }
    }
  }

  &[name="colorDifference"] {
    &:hover,
    &:active,
    &:focus {
      &::after {
        content: attr(value);
      }
    }
  }
`;

export const CodeBlock = styled.div<{ $isSmall?: boolean }>`
  font-size: 10px;
  position: relative;

  pre {
    margin: 0 !important;
    padding: 15px !important;
    background: var(--textColor) !important;
    min-width: 354px;
  }

  @media only screen and (min-width: 1500px) {
    font-size: 12px;

    pre {
      min-width: 430px !important;
    }
  }

  @media only screen and (min-width: 1700px) {
    font-size: 14px;

    pre {
      min-width: 500px !important;
    }
  }

  @media only screen and (max-width: 950px) {
    font-size: 8px;

    pre {
      min-width: 290px !important;
    }
  }

  &:before {
    content: "Copied to clipboard!";
    position: absolute;
    width: 100%;
    height: 100%;
    background: #47a049;
    color: #f6f5f7;
    font-size: 15px;
    font-weight: bold;
    opacity: 0.9;
    vertical-align: middle;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }

  &.copied:before {
    z-index: 2;
  }

  &.copied .copy {
    display: none;
  }
`;

export const CopyButton = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  border-radius: 3px;
  background-color: #3b843c;
  color: white;
  border: none;
  cursor: pointer;
  padding: 3px 7px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const HiddenTextarea = styled.textarea`
  position: absolute;
  left: -9999px;
`;

export const ShapeSwitch = styled.div`
  display: flex;
  overflow: hidden;
  border-radius: 3px;
  flex-grow: 1;
`;

export const ShapeButton = styled.button<{ $isActive?: boolean }>`
  flex-grow: 1;
  padding: 4px 10px;
  background: var(--textColor);
  color: var(--textColorOpposite);
  cursor: pointer;
  outline: 0;
  border: none;
  opacity: ${props => props.$isActive ? 1 : 0.8};
  transition: opacity 0.2s ease;

  svg {
    stroke: var(--textColorOpposite);
    width: 45px;
    pointer-events: none;
  }

  * {
    pointer-events: none;
  }

  &:hover {
    opacity: 1;
  }
`;
