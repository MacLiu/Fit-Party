import React from 'react';
import { View, StyleSheet } from 'react-native';

import Text from 'app/components/Text';
import TextInput, { TextInputSize } from 'app/components/form/TextInput';

type SettingsRowProps = {
  label: string;
};

const SettingsRow: React.FC<SettingsRowProps> = props => {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel} bold>{props.label}</Text>
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 40,
    paddingTop: 20,
    paddingBottom: 20,
  },
  rowLabel: {
    fontSize: 18,
  },
});

export default SettingsRow;
