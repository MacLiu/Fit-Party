import React from 'react';
import { StyleSheet } from 'react-native';

import Text, { TextColor } from 'app/components/Text';
import assertNever from 'app/utils/assertNever';

export enum HeadingColor {
  Orange = 'orange',
  White = 'white',
  Black = 'black',
  Gray = 'gray',
};

type HeadingProps = {
  bold?: boolean;
  center?: boolean;
  color?: HeadingColor;
};

const getHeadingStyle = (props: HeadingProps) => {
  return [
    styles.heading,
    props.center && styles.center,
    props.bold !== false && styles.bold,
  ];
};

const getTextColor = (props: HeadingProps) => {
  if (!props.color) {
    return TextColor.Orange;
  }
  switch (props.color) {
  case HeadingColor.Orange:
    return TextColor.Orange;
  case HeadingColor.White:
    return TextColor.White;
  case HeadingColor.Black:
    return TextColor.Black;
  case HeadingColor.Gray:
    return TextColor.Gray;
  default:
    assertNever(props.color);
  }
}

export const Heading1: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading1];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

export const Heading2: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading2];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

export const Heading3: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading3];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

export const Heading35: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading35];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

export const Heading4: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading4];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

export const Heading5: React.FC<HeadingProps> = (props) => {
  const style: Array<any> = [styles.heading5];
  getHeadingStyle(props).forEach(s => style.push(s));
  return  (
    <Text style={style} color={getTextColor(props)}>
      {props.children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    // paddingTop: 20,
  },
  heading1: {
    fontSize: 38,
  },
  heading2: {
    fontSize: 30,
  },
  heading3: {
    fontSize: 24,
  },
  heading35: {
    fontSize: 20,
  },
  heading4: {
    fontSize: 18,
  },
  heading5: {
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
  center: {
    textAlign: 'center',
  },
});
