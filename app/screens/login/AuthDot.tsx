import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import colors from 'app/assets/colors';

type AuthDotProps = {
  active: boolean;
  style?: StyleProp<ViewStyle>;
};

const AuthDot: React.FC<AuthDotProps> = props => {
  return (
    <View style={[
      props.active ? styles.dotActive : styles.dotInactive ,
      props.active ? styles.active : styles.inactive,
    ]} />
  );
};

const styles = StyleSheet.create({
  dotActive: {
    width: 14,
    height: 14,
    borderRadius: 12 / 2,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  dotInactive: {
    width: 12,
    height: 12,
    borderRadius: 12 / 2,
    marginBottom: 30,
    marginLeft: 5,
    marginRight: 5,
  },
  inactive: {
    backgroundColor: colors.white,
  },
  active: {
    backgroundColor: colors.orange,
  },
});

export default AuthDot;
