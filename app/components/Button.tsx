import React, { useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import Text, { TextColor } from 'app/components/Text';
import assertNever from 'app/utils/assertNever';
import colors from 'app/assets/colors';

export enum ButtonColor {
  Orange = 'orange',
  White = 'white',
  TransparentWhite = 'transparent white',
  Transparent = "transparent",
};

export enum ButtonSize {
  XSmall = 'xsmall',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
};

// export enum TextSize {
//   Small = 'small',
//   Medium = 'medium',
//   Large = 'large',
// }

type ButtonProps = {
  color: ButtonColor;
  disabled?: boolean;
  size: ButtonSize;
  onPress: () => void;
  noShadow?: boolean;
  text?: string;
  textBold?: boolean;
  textSize?: number;
  underline?: boolean;
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = props => {
  const getTextColor = (color: ButtonColor): TextColor => {
    switch (color) {
    case ButtonColor.Orange:
      return TextColor.White;
    case ButtonColor.White:
      return TextColor.Orange;
    case ButtonColor.TransparentWhite:
      return TextColor.White;
    case ButtonColor.Transparent:
      return TextColor.White;
    default:
      assertNever(color);
    }
  }
  const getButtonColorStyle = (color: ButtonColor) => {
    switch (color) {
    case ButtonColor.Orange:
      return styles.orange;
    case ButtonColor.White:
      return styles.white;
    case ButtonColor.TransparentWhite:
      return styles.transparentWhite;
    case ButtonColor.Transparent:
      return styles.transparent;
    default:
      assertNever(color);
    }
  }
  let sizeStyle;
  let textSize;
  switch (props.size) {
  case ButtonSize.XSmall:
    sizeStyle = styles.xsmall;
    textSize = 14;
    break;
  case ButtonSize.Small:
    sizeStyle = styles.small;
    textSize = 16;
    break;
  case ButtonSize.Medium:
    sizeStyle = styles.medium;
    textSize = 18;
    break;
  case ButtonSize.Large:
    sizeStyle = styles.large;
    textSize = 30;
    break;
  default:
    assertNever(props.size);
  }
  let content;
  let spinnerColor;
  switch (props.color) {
    case ButtonColor.Orange:
      spinnerColor = colors.white;
      break;
    case ButtonColor.White:
      spinnerColor = colors.orange;
      break;
    case ButtonColor.TransparentWhite:
    case ButtonColor.Transparent:
      spinnerColor = colors.white;
      break;
    default:
      assertNever(props.color);
  }
  if (props.isLoading) {
    content = <View style={[sizeStyle, styles.loading]}><ActivityIndicator size="small" color={spinnerColor} /></View>;
  } else if (props.text) {
    content = (
      <Text
        color={getTextColor(props.color)}
        bold={!!props.textBold}
        style={[
          sizeStyle,
          props.underline && styles.underlineText,
          {fontSize: props.textSize || textSize}
        ]}
      >
        {props.text}
      </Text>
    );
  } else {
    content = <View style={sizeStyle}>{props.children}</View>;
  }
  return (
    <View
      style={[
        styles.button,
        props.noShadow ? undefined : styles.shadow,
        getButtonColorStyle(props.color),
        props.disabled && styles.disabled,
      ]}
    >
      <TouchableWithoutFeedback
        style={styles.textContainer}
        onPress={props.onPress}
        disabled={props.disabled || props.isLoading}
      >
        {content}
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 30,
  },
  shadow: {
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,  
  },
  disabled: {
    opacity: .5,
  },
  textContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  orange: {
    backgroundColor: colors.orange,
    shadowColor: colors.orange,
  },
  white: {
    backgroundColor: colors.white,
    shadowColor: colors.boxShadowGray,
  },
transparentWhite: {
    backgroundColor: 'transparent',
    borderColor: colors.white,
    borderWidth: 4,
  },
  transparent: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    borderWidth: 0,
  },
  xsmall: {
    paddingTop: 8,
    paddingBottom: 8,
  },
  small: {
    paddingTop: 12,
    paddingBottom: 12,
  },
  medium: {
    paddingTop: 16,
    paddingBottom: 16,
  },
  large: {
    paddingTop: 28,
    paddingBottom: 28,
  },
  underlineText: {
    textDecorationLine: 'underline',
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Button;
