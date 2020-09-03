import React, { useState } from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Heading3, HeadingColor } from 'app/components/Headings';
import Text, { TextColor } from 'app/components/Text';
import colors from 'app/assets/colors';
import { makeRequest } from 'app/utils/network';
import { abandonWorkoutRoute, clearCachedWorkoutSession, clearCachedWorkoutResponse } from 'app/endpoints/workout/workout';

type AbandonWorkoutModalProps = {
  isVisible: boolean;
  onClose: () => void;
  onModalHide: () => void;
  workoutSessionID: string;
}

const { width } = Dimensions.get('window');

const AbandonWorkoutModal = (props: AbandonWorkoutModalProps) => {
  const [showCompleteScreen, setShowCompleteScreen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const abandonWorkout = () => {
    setIsLoading(true);
    setShowCompleteScreen(true)
    clearCachedWorkoutSession().then(() => {
      setIsLoading(false);
      props.onClose();
    });
  }
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
            Abandon Workout
          </Heading3>
          <Text style={styles.detailText} color={TextColor.Black}>Are you sure you want to abandon your workout session?</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              setShowCompleteScreen(true)
              abandonWorkout();
            }}
            style={[styles.button, styles.done]}
            disabled={isLoading}
          >
            {isLoading ? 
              <ActivityIndicator size="small" color={colors.white} />
              : <Text color={TextColor.White} bold style={styles.buttonText}>Abandon session</Text>
            }
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={props.onClose}
            style={styles.button}
          >
            <Text color={TextColor.Gray} style={styles.buttonText}>Cancel</Text>
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
    fontSize: 18,
    textAlign: 'center',
  },
});

export default AbandonWorkoutModal;
