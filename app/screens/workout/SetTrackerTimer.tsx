import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import colors from 'app/assets/colors';
import Text, { TextColor } from 'app/components/Text';

type SetTrackerTimerProps = {
  numSeconds: number;
};

const SetTrackerTimer: React.FC<SetTrackerTimerProps> = props => {
  return (
    <View style={styles.container}>
      {props.numSeconds > 0 ? (
        <Text color={TextColor.Orange} style={{fontSize: 12}}>
          {props.numSeconds + 's'}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.orange,
    borderRadius: 40 / 2,
    display: "flex",
    height: 40,
    justifyContent: "center",
    width: 40,
  },
});

export default SetTrackerTimer;
