import React from 'react';
import validator from 'validator';

import TextInput, { TextInputType, TextInputSize } from 'app/components/form/TextInput';
import { ValidationParams } from 'app/components/form/validation';
import { TextColor } from 'app/components/Text';

type PhoneInputProps = {
  onChange: (value: string) => void;
  value: string;
  validationParams?: ValidationParams;
  autoFocus?: boolean;
  errorColor?: TextColor;
};

const PhoneInput = (props: PhoneInputProps) => {
  const validate = (value: string) => {
    if (!value || !validator.isMobilePhone(value, ['en-US'])) {
      props.validationParams && props.validationParams.onValidate(false);
      return 'Please enter a valid phone number.';
    }
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
  return (
    <TextInput
      onChangeText={props.onChange}
      value={props.value}
      noBorder
      useWhite
      centered
      autoFocus={props.autoFocus}
      placeholder={"Phone Number"}
      type={TextInputType.Numeric}
      size={TextInputSize.Small}
      validation={props.validationParams && {
        ...props.validationParams,
        validate,
      }}
      errorColor={props.errorColor}
    />
  );
}

export default PhoneInput;
