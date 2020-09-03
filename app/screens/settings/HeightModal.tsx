import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { Picker, View, StyleSheet } from 'react-native';
import colors from 'app/assets/colors';
import { Heading3 } from 'app/components/Headings';
import Text, { TextColor } from 'app/components/Text';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getDisplayNameForHeight, getHeightInchesForDisplayName } from 'app/endpoints/user/user';

type HeightModalProps = {
  isVisible: boolean;
  heightInches: number;
  onClose: () => void;
  onPressSetHeight: (height: number) => void;
}

const HeightModal = (props: HeightModalProps) => {
  const options = [];
  for (let i = 36; i < 108; i += 1) {
    options.push( <Picker.Item key={i} label={getDisplayNameForHeight(i)} value={i} />);
  }
  const [height, setHeight] = useState(props.heightInches);
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
    >
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Heading3>How tall are you?</Heading3>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={height}
            onValueChange={(value: number) => setHeight(value)}
          >
            {options}
          </Picker>
        </View>
        <TouchableWithoutFeedback
          onPress={() => {
            props.onPressSetHeight(height);
            props.onClose();
          }}
          style={styles.closeContainer}
        >
          <Text bold style={styles.closeText} color={TextColor.Orange}>Set height</Text>
        </TouchableWithoutFeedback>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: 30,
  },
  headingContainer: {
    marginTop: 18,
    marginBottom: 12,
  },
  pickerContainer: {
    width: 150,
  },
  closeContainer: {
    paddingBottom: 12,
  },
  closeText: {
    fontSize: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
});

export default HeightModal;
