import React from 'react';
import { StyleSheet, View } from 'react-native';

import colors from 'app/assets/colors';

type CardProps = {
  noPadding?: boolean;
};

const Card: React.FC<CardProps> = props => {
  return (
    <View style={[styles.container, props.noPadding && styles.noPadding]}>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: colors.boxShadowGray,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 10,  
  },
  noPadding: {
    padding: 0,
  },
});

export default Card;
