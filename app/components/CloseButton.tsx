import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import assertNever from 'app/utils/assertNever';

export enum CloseButtonColor {
  Orange = 'Orange',
  White = 'White',
};

type CloseButtonProps = {
  onPress: () => void;
  color: CloseButtonColor;
};

const CloseButton = (props: CloseButtonProps) => {
  let imageSrc;
  switch (props.color) {
  case CloseButtonColor.Orange:
    imageSrc = require('app/assets/images/components/closeButtonOrange.png');
    break;
  case CloseButtonColor.White:
    imageSrc = require('app/assets/images/components/closeButtonWhite.png');
    break;
  default:
    assertNever(props.color);
  }

  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      style={styles.closeButton}
    >
      <Image source={imageSrc}/>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    backgroundColor: "transparent",
  },
})

export default CloseButton;
