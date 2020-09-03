import React from 'react';

import { TextInputSize } from 'app/components/form/TextInput';
import SettingsRow from 'app/screens/settings/SettingsRow';
import NumberInput, { NumberInputColor } from 'app/components/form/NumberInput';

type SettingsNumberRowProps = {
  label: string;
  value: string;
  maxDigits: number;
  onChangeText: (value: string) => void;
};

const SettingsNumberRow: React.FC<SettingsNumberRowProps> = props => {
  return (
    <SettingsRow
      label={props.label}
    >
      <NumberInput
        color={NumberInputColor.Orange}
        onChange={props.onChangeText}
        value={props.value}
        size={TextInputSize.Small}
        centered
        maxDigits={props.maxDigits}
      />
      {props.children}
    </SettingsRow>
  );
};

export default SettingsNumberRow;
