import React from 'react';

import TextInput, { TextInputType, TextInputSize } from 'app/components/form/TextInput';
import { ValidationParams } from 'app/components/form/validation';

export enum  NumberInputColor {
  Orange = 'Orange',
  White = 'White',
};

type NumberInputProps = {
  onChange: (value: string) => void;
  value: string;
  validationParams?: ValidationParams;
  size: TextInputSize;
  centered?: boolean;
  maxDigits: number;
  upperBound?: number;
  color: NumberInputColor;
  noBorder?: boolean;
  placeholder?: string;
};

// Only supports integers
const NumberInput = (props: NumberInputProps) => {
  const validate = (value: string) => {
    if (props.validationParams && props.validationParams.validate) {
      const errorMsg = props.validationParams.validate(value);
      if (errorMsg) {
        props.validationParams && props.validationParams.onValidate(false);
        return errorMsg;
      }
    }
    props.validationParams && props.validationParams.onValidate(true);
    return null;
  };
  const onChange = (value: string) => {
    const trimmed = value.replace(/\D/g,'');
    if (props.upperBound && parseInt(trimmed) > props.upperBound) {
      return props.onChange(trimmed.substring(0, trimmed.length - 1));
    }
    props.onChange(trimmed);
  }
  return (
    <TextInput
      onChangeText={onChange}
      value={props.value}
      bottomBorderOnly={!props.noBorder}
      noBorder={props.noBorder}
      useWhite={props.color === NumberInputColor.White}
      type={TextInputType.Numeric}
      size={props.size}
      validation={props.validationParams && {
        ...props.validationParams,
        validate,
      }}
      centered={props.centered}
      maxLength={props.maxDigits}
      placeholder={props.placeholder}
    />
  );
}

export default NumberInput;
