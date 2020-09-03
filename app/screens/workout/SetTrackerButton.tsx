import React from 'react';
import { StyleSheet, Dimensions } from 'react-native';

import colors from 'app/assets/colors';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Text, { TextColor } from 'app/components/Text';
import { SetDetail } from 'app/endpoints/workout/workout';
import { breakpoint375 } from 'app/utils/screenSize';

type SetTrackerButtonProps = {
  disabled?: boolean;
  currentSetDetail: SetDetail;
  weight: number;
  maxReps: number;
  onInitialPress: () => void;
  onChange: (setDetail: SetDetail) => void;
};

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

const SetTrackerButton = (props: SetTrackerButtonProps) => {
  const currentReps = props.currentSetDetail.result_reps || 0;
  const onPress = () => {
    if (currentReps === 0) {
      props.onInitialPress();
    }
    props.onChange({
      ...props.currentSetDetail,
      result_reps: currentReps === 0 ? props.maxReps : currentReps - 1,
      result_weight: props.weight,
    });
  }
  
  return (
    // TODO(danielc): Add haptic feedback
    <TouchableWithoutFeedback
      style={[styles.container, currentReps === 0 ? styles.inactive : styles.active]}
      disabled={props.disabled}
      onPress={onPress}
    >
      <Text color={TextColor.White} style={styles.text}>{currentReps > 0 && currentReps}</Text>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: 8,
    display: "flex",
    height: isSmallWidth ? 32 : 36,
    justifyContent: "center",
    width: isSmallWidth ? 28 : 32,
  },
  active: {
    backgroundColor: colors.orange,
  },
  inactive: {
    backgroundColor: colors.lightOrange,
  },
  text: {
    fontSize: isSmallWidth ? 14 : 18,
  },
})

export default SetTrackerButton;
