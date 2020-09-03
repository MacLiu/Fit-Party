import React from 'react';
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native';

import { getWeightInPounds, Weight } from 'app/utils/weight';
import colors from 'app/assets/colors';
import Text, { TextColor } from 'app/components/Text';

type WeightButtonProps = {
  weight: Weight;
  disabled: boolean;
  onPress: () => void;
};

const WeightButton = (props: WeightButtonProps) => {
  return (
  // TODO(danielc): Add haptic feedback
  <TouchableWithoutFeedback
    onPress={props.onPress}
    disabled={props.disabled}
  >
    <View style={styles.button}>
      <Text color={TextColor.Orange} style={{fontSize: 11}}>
        {getWeightInPounds(props.weight)}
      </Text>
    </View>
  </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.lightOrange,
    borderRadius: 8,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
  },
});

export default WeightButton;
