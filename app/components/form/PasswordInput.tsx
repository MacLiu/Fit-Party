import React from 'react';
import TextInput, { TextInputSize } from 'app/components/form/TextInput';
import { ValidationParams } from 'app/components/form/validation';
import { TextColor } from '../Text';

type PasswordInputProps = {
  onChange: (value: string) => void;
  value: string;
  validationParams?: ValidationParams;
  isPasswordConfirmation?: boolean;
  errorColor?: TextColor;
};

const PasswordInput = (props: PasswordInputProps) => {
  const validate = (value: string) => {
    if (!value) {
      props.validationParams && props.validationParams.onValidate(false);
      return 'Please enter a password.';
    }
    if (value.length < 8) {
      props.validationParams && props.validationParams.onValidate(false);
      return 'Password must be greater than 8 characters.';
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
  }
  return (
    <TextInput
      onChangeText={props.onChange}
      value={props.value}
      noBorder
      centered
      useWhite
      placeholder={props.isPasswordConfirmation ? "Confirm Password" : "Password"}
      size={TextInputSize.Small}
      secureTextEntry
      validation={props.validationParams && {
        ...props.validationParams,
        validate,
      }}
      errorColor={props.errorColor}
    />
  );
};

export default PasswordInput;
