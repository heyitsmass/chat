import React, { useEffect, useRef } from "react";
import { LightSource } from "./styles";
import { PreviewContainer, SoftShadow } from "./styles";
import { PreviewProps } from "./types";

const Preview: React.FC<PreviewProps> = ({ previewBox, setActiveLightSource }) => {
  const lightSources = useRef<NodeListOf<Element> | null>(null);

  useEffect(() => {
    lightSources.current = document.querySelectorAll(".light-source");
  }, []);

  const setLightSource = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lightSources.current) {
      lightSources.current.forEach((element) => {
        element.classList.remove("active");
      });
    }
    
    const target = e.target as HTMLDivElement;
    target.classList.add("active");
    const dataValue = target.dataset.value;
    if (dataValue) {
      setActiveLightSource(parseInt(dataValue));
    }
  };

  return (
    <PreviewContainer>
      <LightSource
        $top="0"
        $bottom="unset"
        $right="0"
        $left="unset"
        data-value="2"
        onClick={setLightSource}
        className="light-source"
      />
      <LightSource
        $top="0"
        $bottom="unset"
        $right="unset"
        $left="0"
        data-value="1"
        onClick={setLightSource}
        className="light-source active"
      />
      <LightSource
        $top="unset"
        $bottom="0"
        $right="0"
        $left="unset"
        data-value="3"
        onClick={setLightSource}
        className="light-source"
      />
      <LightSource
        $top="unset"
        $bottom="0"
        $right="unset"
        $left="0"
        data-value="4"
        onClick={setLightSource}
        className="light-source"
      />
      <SoftShadow ref={previewBox} className="soft-element soft-shadow" />
    </PreviewContainer>
  );
};

export default Preview;
