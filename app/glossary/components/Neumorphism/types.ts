export interface LightSourceProps {
  $top?: string;
  $bottom?: string;
  $right?: string;
  $left?: string;
  'data-value': string;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
}

export interface PreviewProps {
  previewBox: React.RefObject<HTMLDivElement | null>;
  setActiveLightSource: (value: number) => void;
}

export interface ConfigurationProps {
  previewBox: React.RefObject<HTMLDivElement | null>;
  activeLightSource: number;
}

export interface ConfigurationRowProps {
  label: string;
  type: string;
  value: number | string;
  min?: string;
  max?: string | number;
  step?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ShapeSwitcherProps {
  shape: number;
  setShape: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface StyledComponentsTheme {
  colors: {
    textColor: string;
    textColorOpposite: string;
    baseColor: string;
    darkColor: string;
    lightColor: string;
    firstGradientColor: string;
    secondGradientColor: string;
  };
  dimensions: {
    positionX: string;
    positionXOpposite: string;
    positionY: string;
    positionYOpposite: string;
    blur: string;
    size: string;
    radius: string;
  };
  angle: string;
}
