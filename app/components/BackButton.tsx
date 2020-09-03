import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import assertNever from 'app/utils/assertNever';

export enum BackButtonColor {
  Orange = 'Orange',
  White = 'White',
};

type BackButtonProps = {
  onPress: () => void;
  color: BackButtonColor;
};

const BackButton = (props: BackButtonProps) => {
  let imageSrc;
  switch (props.color) {
  case BackButtonColor.Orange:
    imageSrc = require('app/assets/images/components/backButtonOrange.png');
    break;
  case BackButtonColor.White:
    imageSrc = require('app/assets/images/components/backButtonWhite.png');
    break;
  default:
    assertNever(props.color);
  }
  return (
    <TouchableWithoutFeedback
      onPress={props.onPress}
      style={styles.backButton}
    >
      <Image
        source={imageSrc}
      />
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  backButton: {
  },
})

export default BackButton;
