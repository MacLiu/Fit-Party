import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import colors from 'app/assets/colors';

type DotProps = {
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

const Dot: React.FC<DotProps> = props => {
  return (
    <View style={[
      styles.dot,
      props.active ? styles.active : styles.inactive,
    ]} />
  );
};

const styles = StyleSheet.create({
  dot: {
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  inactive: {
    backgroundColor: colors.lightGray,
  },
  active: {
    backgroundColor: colors.orange,
  },
});

export default Dot;
