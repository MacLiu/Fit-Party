import React from 'react';
import { StyleSheet } from 'react-native';
import { TextColor } from 'app/components/Text';
import SettingsRow from 'app/screens/settings/SettingsRow';
import Dropdown from 'app/components/Dropdown';

type SettingsDropdownRowProps = {
  label: string;
  value: string;
  options: Array<string>;
  onPressValue: (value: string) => void;
};

const SettingsDropdownRow = (props: SettingsDropdownRowProps) => {
  return (
    <SettingsRow
      label={props.label}
    >
      <Dropdown
        value={props.value}
        options={props.options}
        onPressValue={props.onPressValue}
        textColor={TextColor.Black}
        showArrow={false}
        textSize={18}
      />
    </SettingsRow>
  );
};

export default SettingsDropdownRow;
