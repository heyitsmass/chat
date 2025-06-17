import React from "react";
import { Row, Label, RangeInput } from "./styles";
import { ConfigurationRowProps } from "./types";
import { camelize } from "./utils";

const ConfigurationRow: React.FC<ConfigurationRowProps> = ({
  label,
  type,
  value,
  min,
  max,
  step = "1",
  onChange,
}) => {
  const inputId = camelize(label);

  return (
    <Row>
      <Label htmlFor={inputId} $opacity={0.6}>
        {label}{" "}
      </Label>
      <RangeInput
        type={type}
        name={inputId}
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        step={step}
        id={inputId}
      />
    </Row>
  );
};

export default ConfigurationRow;
