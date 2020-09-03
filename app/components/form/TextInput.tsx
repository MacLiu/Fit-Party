import React, { useState, useEffect } from 'react'
import { TextInput as _TextInput, StyleSheet, View } from 'react-native';
import colors from 'app/assets/colors';
import assertNever from 'app/utils/assertNever';
import Text, { TextColor } from 'app/components/Text';
import { ValidationParams } from 'app/components/form/validation';

export enum TextInputType {
  Numeric = 'numeric',
};

export enum TextInputSize {
  Small = 'small',
  Medium = 'medium',
  MediumLarge = "medium-large",
  Large = 'large',
};

type TextInputProps = {
  onChangeText: (text: string) => void;
  placeholder?: string;
  value: string;
  type?: TextInputType;
  bottomBorderOnly?: boolean;
  size: TextInputSize;
  centered?: boolean;
  secureTextEntry?: boolean;
  validation?: ValidationParams;
  maxLength?: number;
  useWhite?: boolean;
  noBorder?: boolean;
  autoFocus?: boolean;
  errorColor?: TextColor;
  onBlur?: () => void;
  // textFontSize?: number;
};

const TextInput: React.FC<TextInputProps> = props => {
  const [errorMsg, setErrorMsg] = useState('');
  const validation = props.validation;
  useEffect(() => {
    if (validation && validation.shouldValidate && validation.validate) {
      const err = validation.validate(props.value);
      if (err && validation.showErrorMessage) {
        setErrorMsg(err);
      }
    }
  }, [props.validation]);
  if (validation && validation.validateOnChange) {
    useEffect(() => {
      if (validation.shouldValidate && validation.validate) {
        const err = validation.validate(props.value);
        if (err && validation.showErrorMessage) {
          setErrorMsg(err);
        }
      }
    }, [props.value]);
  }
  const onChange = (value: string) => {
    setErrorMsg('');
    props.onChangeText(value);
  }
  let sizeStyle;
  switch (props.size) {
  case TextInputSize.Small:
    sizeStyle = styles.small
    break;
  case TextInputSize.Medium:
    sizeStyle = styles.medium;
    break;
  case TextInputSize.MediumLarge:
    sizeStyle = styles.mediumLarge;
    break;
  case TextInputSize.Large:
    sizeStyle = styles.large;
    break;
  default:
    assertNever(props.size);
  }
  return (
    <View style={styles.container}>
      <_TextInput
        style={[
          props.noBorder
            ? styles.noBorder
            : (props.bottomBorderOnly
              ? styles.bottomOnly
              : styles.input
            ),
          sizeStyle,
          props.centered && {textAlign: 'center'},
          props.useWhite ? {color: colors.white} : {color: colors.black},
          styles.textInput
        ]}
        autoFocus={props.autoFocus}
        onChangeText={onChange}
        placeholder={props.placeholder}
        placeholderTextColor={props.useWhite ? 'rgba(255, 255, 255, 0.6)' : colors.gray }
        value={props.value}
        keyboardType={props.type}
        secureTextEntry={props.secureTextEntry}
        textContentType={props.secureTextEntry ? 'oneTimeCode' : undefined}
        returnKeyType='done'
        maxLength={props.maxLength}
        onBlur={props.onBlur}
      />
      {!!errorMsg && <Text color={props.errorColor || TextColor.Red} center>{errorMsg}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  textInput: {
    fontFamily: 'Avenir-Light',
  },
  input: {
    borderColor: colors.orange,
    borderRadius: 16,
    borderWidth: 2,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
  },
  small: {
    fontSize: 18,
  },
  medium: {
    fontSize: 24,
  },
  mediumLarge: {
    fontSize: 36,
  },
  large: {
    fontSize: 50,
  },
  bottomOnly: {
    borderBottomColor: colors.orange,
    borderBottomWidth: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 5,
    paddingBottom: 5,
  },
  noBorder: {
    // paddingLeft: 5,
    // paddingRight: 5,
    // paddingTop: 5,
    // paddingBottom: 5,
    padding: 0,
  },
});

export default TextInput;
