import React from 'react';
import Modal from 'react-native-modal';
import { Picker, View, StyleSheet } from 'react-native';
import colors from 'app/assets/colors';
import { Heading3 } from 'app/components/Headings';
import Text, { TextColor } from 'app/components/Text';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type WeightModalProps = {
  isVisible: boolean;
  weightPounds: number;
  setWeight: (weight: number) => void;
  onClose: () => void;
}

const WeightModal = (props: WeightModalProps) => {
  const options = [];
  for (let i = 5; i < props.weightPounds + 300; i += 5) {
    options.push(<Picker.Item key={i} label={`${i} lbs`} value={i} />)
  }
  return (
    <Modal
      isVisible={props.isVisible}
      onBackdropPress={props.onClose}
    >
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Heading3>Choose your weight</Heading3>
        </View>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={props.weightPounds}
            // style={styles.picker}
            onValueChange={value => props.setWeight(value)}
          >
            {options}
          </Picker>
        </View>
        <TouchableWithoutFeedback
          onPress={props.onClose}
          style={styles.closeContainer}
        >
          <Text bold style={styles.closeText} color={TextColor.Orange}>Set Weight</Text>
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

export default WeightModal;
