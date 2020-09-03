import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import colors from 'app/assets/colors';
import Text, { TextColor } from 'app/components/Text';

type CardioSessionTimerProps = {
  numSeconds: number;
  numMinutes: number;
};

const CardioSessionTimer: React.FC<CardioSessionTimerProps> = props => {
  return (
    <View style={styles.container}>
      <Text color={TextColor.White} style={{fontSize: 36}}>
        {props.numMinutes < 10 ? "0": ""}{props.numMinutes}:{props.numSeconds < 10 ? "0": ""}{props.numSeconds}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 10,
    borderColor: colors.white,
    borderRadius: 250 / 2,
    display: "flex",
    height: 250,
    justifyContent: "center",
    width: 250,
  },
});

export default CardioSessionTimer;
