import React, { useEffect, useState, useRef, useContext } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import Card from 'app/components/Card';
import { Heading3, Heading5, HeadingColor } from 'app/components/Headings';
import SetTrackerButton from 'app/screens/workout/SetTrackerButton';
import SetTrackerTimer from 'app/screens/workout/SetTrackerTimer';
import WeightButton from 'app/screens/workout/WeightButton';
import { WeightUnit } from 'app/utils/weight';
import Paragraph, { ParagraphColor, ParagraphSize } from 'app/components/Paragraph';
import { SetDetail, Exercise, baseExerciseImageURLPath } from 'app/endpoints/workout/workout';
import WeightModal from 'app/screens/workout/WeightModal';
import Text, { TextColor } from 'app/components/Text';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import colors from 'app/assets/colors';
import { TimerContext } from 'app/screens/workout/workoutState';

type WorkoutCardProps = {
  isComplete?: boolean;
  exercise: Exercise;
  showWeight: boolean;
  setDetails: Array<SetDetail>;
  onChange: (setDetails: Array<SetDetail>) => void;
  onPressSwap: () => void;
  timerKey: string;
  onInitialSetTrackerPress: () => void;
};

const { width } = Dimensions.get('window');

function usePrevious(exercise: Exercise) {
  const ref = useRef<Exercise | undefined>(undefined);
  useEffect(() => {
    ref.current = exercise;
  });
 return ref.current;
}

const WorkoutCard: React.FC<WorkoutCardProps> = props => {
  const [isWeightModalVisible, setIsWeightModalVisible] = useState(false);
  const weightPounds = props.setDetails[0].weight
  const onPressWeightButton = () => setIsWeightModalVisible(true);
  const onChangeWeight = (weight: number) => {
    const newSetDetails = props.setDetails;
    newSetDetails[0].weight = weight;
    props.onChange(newSetDetails);
  }
  const { timerState } = useContext(TimerContext);
  const setTrackers = [];
  for (let i = 0; i < props.setDetails.length; i++) {
    setTrackers.push(
      <View
        key={i}
      >
        <View style={{paddingRight: 9}}>
          <SetTrackerButton
            disabled={props.isComplete}
            // TODO: Implement variable reps
            currentSetDetail={props.setDetails[i]}
            maxReps={props.setDetails[0].reps}
            weight={weightPounds}
            onInitialPress={props.onInitialSetTrackerPress}
            onChange={(setDetail: SetDetail) => {
              const newSetDetails = props.setDetails;
              newSetDetails[i] = setDetail;
              props.onChange(newSetDetails);
            }}
          />
        </View>
      </View>
    );
  }
  const imageSource = {uri: baseExerciseImageURLPath + props.exercise.image_url_path};
  return (
    <Card>
      <View style={styles.header}>
        <View style={styles.headingContainer}>
          <Heading3 color={HeadingColor.Black}>{props.exercise.exercise_name}</Heading3>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            color={ButtonColor.White}
            onPress={props.onPressSwap}
            size={ButtonSize.XSmall}
            noShadow
            text='Swap'
            textBold
            underline
          />
        </View>
      </View>
      <View style={styles.imageContainer}>
        <FastImage
          source={imageSource}
          style={styles.image}
        />
      </View>
      <View style={styles.workoutInfoContainer}>
        <View style={styles.setDetails}>
          <Heading5>{props.setDetails.length} sets x {props.setDetails[0].reps} reps</Heading5>
        </View>
        {props.showWeight &&
          <WeightButton
            weight={{ amount: weightPounds, units: WeightUnit.Pounds }}
            disabled={!!props.isComplete}
            onPress={onPressWeightButton}
          />
        }
      </View>
      <View style={styles.setTrackersContainer}>
        <View style={styles.setTrackers}>
          {setTrackers}
        </View>
        <View style={styles.setTrackerTimerContainer}>
          {!props.isComplete &&
            <SetTrackerTimer numSeconds={timerState.timers.get(props.timerKey) || 0} />
          }
          {!props.isComplete && <Text color={TextColor.Orange} style={styles.restTimerText}>Rest timer</Text>}
        </View>
      </View>
      <View style={styles.paragraphContainer}>
        <Paragraph color={ParagraphColor.Black} size={ParagraphSize.Small}>
          Tap the box to log each set, the rest timer will then start immediately after. To reduce the number of reps, tap the box multiple times.  
        </Paragraph>
      </View>
      <WeightModal
        isVisible={isWeightModalVisible}
        weightPounds={weightPounds}
        setWeight={onChangeWeight}
        onClose={() => setIsWeightModalVisible(false)}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: 'center',
  },
  headingContainer: {
    flex: .8,
  },
  buttonContainer: {
    width: width * .175,
    borderColor: colors.orange,
    borderRadius: width * .15 / 3.5,
    borderWidth: 1,
  },
  imageContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  image: {
    width: 250,
    height: 250,
  },
  workoutInfoContainer: {
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  setDetails: {
    alignSelf: "flex-end",
  },
  setTrackersContainer: {
    flex: 1,
    alignItems: "center",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  setTrackers: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
  },
  setTrackerTimerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
  },
  restTimerText: {
    fontSize: 12,
    marginTop: 3,
  },
  paragraphContainer: {
    width: width * .8,
  },
});

export default WorkoutCard;
