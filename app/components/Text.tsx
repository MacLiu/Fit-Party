import React from 'react';
import { Text as _Text, StyleSheet } from 'react-native';

import assertNever from 'app/utils/assertNever';
import colors from 'app/assets/colors';
import fonts from 'app/assets/fonts';

export enum TextColor {
  Black = 'black',
  White = 'white',
  Orange = 'orange',
  LightGray = 'light gray',
  Red = 'red',
  Gray = "gray",
};

type TextProps = {
  bold?: boolean;
  color?: TextColor;
  style?: any | Array<any>;
  underline?: boolean;
  center?: boolean;
};

const Text: React.FC<TextProps> = props => {
  const style: Array<any> = [styles.text];
  if (props.style) {
    if (Array.isArray(props.style)) {
      props.style.forEach(s => style.push(s));
    } else {
      style.push(props.style);
    }
  }
  let colorStyle;
  if (props.color) {
    switch (props.color) {
    case TextColor.Black:
      colorStyle = styles.black;
      break;
    case TextColor.White:
      colorStyle = styles.white;
      break;
    case TextColor.Orange:
      colorStyle = styles.orange;
      break;
    case TextColor.LightGray:
      colorStyle = styles.lightGray;
      break;
    case TextColor.Red:
      colorStyle = styles.red;
      break;
    case TextColor.Gray:
      colorStyle = styles.gray;
      break;
    default:
      assertNever(props.color);
    }
  }
  style.push(colorStyle || styles.black);
  props.bold && style.push(styles.bold);
  props.underline && style.push({ textDecorationLine: 'underline' });
  props.center && style.push({ textAlign: 'center' });
  return (
    <_Text style={style}>{props.children}</_Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.default,
  },
  black: {
    color: colors.black,
  },
  white: {
    color: colors.white,
  },
  orange: {
    color: colors.orange,
  },
  lightGray: {
    color: colors.lightGray,
  },
  red: {
    color: colors.red,
  },
  gray: {
    color: colors.gray,
  },
  bold: {
    fontWeight: 'bold',
  },
});

export default Text;
