import React from 'react';

import TextInput, { TextInputSize } from 'app/components/form/TextInput';
import SettingsRow from 'app/screens/settings/SettingsRow';

type SettingsTextRowProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onBlur?: () => void;
};

const SettingsTextRow = (props: SettingsTextRowProps) => {
  return (
    <SettingsRow
      label={props.label}
    >
      <TextInput
        onChangeText={props.onChangeText}
        value={props.value}
        size={TextInputSize.Small}
        noBorder
        onBlur={props.onBlur}
      />
    </SettingsRow>
  );
};

export default SettingsTextRow;
