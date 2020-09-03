import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import Text from 'app/components/Text';
import Card from 'app/components/Card';
import { Heading3, HeadingColor, Heading4 } from 'app/components/Headings';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { displayNameForWorkoutType, WorkoutType, WorkoutLength, displayNameForWorkoutLength, displayNameWithTimeForWorkoutLength, workoutLengthForDisplayNameWithTime, CalorieRange } from 'app/endpoints/workout/workout';
import Dropdown from 'app/components/Dropdown';
import { TextColor } from 'app/components/Text';
import assertNever from 'app/utils/assertNever';
import { breakpoint375 } from 'app/utils/screenSize';

const { height, width } = Dimensions.get('window');
const isSmallWidth = width <= breakpoint375;

export enum StartWorkoutCardStatus {
  NotStarted = 'Not started',
  InProgress = 'In progress',
  Complete = 'Complete',
};

type StartWorkoutCardProps = {
  status: StartWorkoutCardStatus;
  workoutType: WorkoutType;
  workoutLength: WorkoutLength;
  estimatedCalories?: CalorieRange;
  onChangeWorkoutLength: (wl: WorkoutLength) => void;
  imageSrc: any; // TODO(danielc): type this better
  onPress: () => void;
  useXSmallButton?: boolean;
};

const StartWorkoutCard = (props: StartWorkoutCardProps) => {
  const workoutLengths = new Array<string>();
  for (let wl in WorkoutLength) {
    workoutLengths.push(displayNameWithTimeForWorkoutLength(wl as any as WorkoutLength));
  }
  let buttonText;
  switch (props.status) {
  case StartWorkoutCardStatus.NotStarted:
    buttonText =  'Start Workout';
    break;
  case StartWorkoutCardStatus.InProgress:
    buttonText = 'Continue Workout';
    break;
  case StartWorkoutCardStatus.Complete:
    buttonText = 'View Workout';
    break;
  default:
    assertNever(props.status);
  }
  return (
    <Card>
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.header}>
            {isSmallWidth
              ? <Heading4 color={HeadingColor.Black}>{displayNameForWorkoutType(props.workoutType)}</Heading4>
              : <Heading3 color={HeadingColor.Black}>{displayNameForWorkoutType(props.workoutType)}</Heading3>
            }
          </View>
          <View style={styles.dropdownContainer}>
            <Dropdown
              options={workoutLengths}
              value={displayNameForWorkoutLength(props.workoutLength)}
              onPressValue={(value: string) => props.onChangeWorkoutLength(workoutLengthForDisplayNameWithTime(value) as any as WorkoutLength)}
              textColor={TextColor.White}
              showArrow={props.status === StartWorkoutCardStatus.NotStarted}
              disabled={props.status !== StartWorkoutCardStatus.NotStarted}
            />
          </View>
        </View>
        {props.estimatedCalories && 
          <Text style={styles.calories} color={TextColor.Orange}>Est. Cal: {props.estimatedCalories}</Text>
        }
      </View>
      <View style={styles.imageContainer}>
        <FastImage source={props.imageSrc} style={styles.image}/>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={ButtonColor.Orange}
          size={props.useXSmallButton ? ButtonSize.XSmall : ButtonSize.Small}
          text={buttonText}
          onPress={props.onPress}
          textSize={isSmallWidth ? 16 : 18}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 8,
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(234, 80, 59, 0.4)',
    width: 100,
    borderRadius: 25,
  },
  calories: {
    fontSize: 14,
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 18,
    paddingBottom: 18,
  },
  image: {
    // height: 233,
    // width: 275,
    height: height * .25,
    width: height * .25 * 1.18,
    // transform: [{ scale: .75 }],
  },
  buttonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default StartWorkoutCard;
