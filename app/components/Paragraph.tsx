import React from 'react';
import { StyleSheet } from 'react-native';

import colors from 'app/assets/colors';
import Text from 'app/components/Text';
import assertNever from 'app/utils/assertNever';

export enum ParagraphSize {
  XSmall = 'xsmall',
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
};

export enum ParagraphColor {
  White = 'white',
  Black = 'black',
  Orange = 'orange',
};

type ParagraphProps = {
  color: ParagraphColor;
  size: ParagraphSize;
};

const Paragraph: React.FC<ParagraphProps> = props => {
  let sizeStyle;
  switch (props.size) {
  case ParagraphSize.XSmall:
    sizeStyle = styles.xsmall;
    break;
  case ParagraphSize.Small:
    sizeStyle = styles.small;
    break;
  case ParagraphSize.Medium:
    sizeStyle = styles.medium;
    break;
  case ParagraphSize.Large:
    sizeStyle = styles.large;
    break;
  default:
    assertNever(props.size);
  }
  let colorStyle;
  switch (props.color) {
  case ParagraphColor.White:
    colorStyle = styles.white;
    break;
  case ParagraphColor.Black:
    colorStyle = styles.black;
    break;
  case ParagraphColor.Orange:
    colorStyle = styles.orange;
    break;
  default:
    assertNever(props.color);
  }
  return <Text style={[styles.paragraph, sizeStyle, colorStyle]}>{props.children}</Text>;
};

const styles = StyleSheet.create({
  paragraph: {
    fontWeight: 'normal',
  },
  xsmall: {
    fontSize: 10,
  },
  small: {
    fontSize: 12,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 20,
  },
  white: {
    color: colors.white,
  },
  black: {
    color: colors.black,
  },
  orange: {
    color: colors.orange,
  },
});

export default Paragraph;
