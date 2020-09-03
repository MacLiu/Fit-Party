import React from 'react';
import { ActionSheetIOS, StyleSheet, Image } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import Text, { TextColor } from 'app/components/Text';

type DropdownProps = {
  disabled?: boolean;
  value: string;
  onPressValue: (value: string) => void;
  options: Array<string>;
  textColor: TextColor;
  showArrow: boolean;
  textSize?: number;
};

const Dropdown = (props: DropdownProps) => {
  const options = props.options;
  if (options.length > 0 && options[0] != 'Cancel') {
    options.unshift('Cancel');
  }
  const onPress = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: options,
      cancelButtonIndex: 0,
    }, buttonIndex => {
      if (buttonIndex === 0) {
        return;
      }
      props.onPressValue(options[buttonIndex]);
    });
  }
  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      style={styles.container}
      disabled={props.disabled}
    >
      <Text style={props.textSize ? {fontSize: props.textSize} : styles.textSize} color={props.textColor}>{props.value}</Text>
      {props.showArrow &&
        <Image
          source={require('app/assets/images/components/dropdownOrange.png')}
          style={styles.image}
        />
      }
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textSize: {
    fontSize: 15,
  },
  image: {
    marginLeft: 8,
  },
});

export default Dropdown;
