import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Heading3, HeadingColor } from 'app/components/Headings';
import Text, { TextColor } from 'app/components/Text';
import colors from 'app/assets/colors';

type CompleteWorkoutModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onModalHide: () => void;
  isCardio?: boolean;
}

const { width, height } = Dimensions.get('window');

const CompleteWorkoutModal = (props: CompleteWorkoutModalProps) => {
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  return (
    <Modal
      isVisible={props.isVisible}
      style={styles.modal}
      onModalHide={showCompleteScreen ? props.onModalHide : undefined}
      animationOut={showCompleteScreen ? 'fadeOut' : undefined}
      onBackdropPress={props.onClose}
      animationOutTiming={showCompleteScreen ? 1 : undefined}
    >
      <View style={styles.content}>
        <View style={styles.headingContainer}>
          <Heading3 
            center 
            bold 
            color={HeadingColor.Black} 
          >
            {props.isCardio ? "Finish cardio session" : "Finish workout"}
          </Heading3>
          <Text style={styles.detailText} color={TextColor.Black}>Are you sure you want to end your {props.isCardio ? "cardio" : "workout"} session?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowCompleteScreen(true)
              props.onClose();
            }}
            style={[styles.button, styles.done]}
          >
            <Text color={TextColor.White} bold style={styles.buttonText}>End session</Text>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={props.onClose}
            style={styles.button}
          >
            <Text color={TextColor.LightGray} style={styles.buttonText}>Cancel</Text>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 6,
    overflow: 'hidden',
    width: width * .85,
  },
  headingContainer: {
    paddingTop: 36,
    paddingBottom: 20,
    paddingLeft: 60,
    paddingRight: 60,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 12,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "center",
    alignItems: "center",
    width: width * .85,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 18,
    borderRadius: 8,
    width: width * .7,
  },
  done: {
    backgroundColor: colors.orange,
  },
  detailText: {
    marginTop: 30,
    textAlign: "center",
  },
  buttonText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

export default CompleteWorkoutModal;
