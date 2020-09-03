import React, { useState }  from 'react';
import { View, StyleSheet, TouchableHighlight, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import colors from 'app/assets/colors';
import Text from 'app/components/Text';
import Card from 'app/components/Card';
import { Heading3, Heading4, HeadingColor } from 'app/components/Headings';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { displayNameForWorkoutType, WorkoutType, WorkoutLength, displayNameForWorkoutLength, displayNameWithTimeForWorkoutLength, workoutLengthForDisplayNameWithTime, CalorieRange } from 'app/endpoints/workout/workout';
import Dropdown from 'app/components/Dropdown';
import { TextColor } from 'app/components/Text';
import assertNever from 'app/utils/assertNever';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type CardioCardProps = {
  isActiveSession: boolean;
  durationMinutes: number;
  activeSessionType: CardioType;
  onPressStart: () => void;
  handleDurationChange: (duration: number) => void;
  handleCardioTypeChange: (type: CardioType) => void;
};

export enum CardioType {
  Run = 'Run',
  Bike = 'Bike',
  Elliptical = 'Elliptical',
  Swim = 'Swim',
};

const NEXT_CARDIO_TYPE = {
  'Run': CardioType.Bike,
  'Bike': CardioType.Elliptical,
  'Elliptical': CardioType.Swim,
  'Swim': CardioType.Run,
};

const CARDIO_TYPE_TO_DESC = {
  'Run': "Go for a run outside or on a treadmill for the set duration.",
  'Bike': "Go for a bike ride outside or on a bike machine for the set duration.",
  'Elliptical': "Go on an elliptical machine for the set duration.",
  'Swim': "Go for a swim for the set duration.",
};

const CardioCard = (props: CardioCardProps) => {
  const [duration, setDuration] = useState(props.isActiveSession ? props.durationMinutes : 10);
  const [cardioType, setCardioType] = useState(CardioType.Run);
  return (
    <View style={styles.container}>
      <View style={styles.sessionHeader}>
          <Heading4 color={HeadingColor.Gray}>Cardio</Heading4>
          { !props.isActiveSession && 
            <TouchableHighlight style={styles.changeButton} underlayColor={colors.lightOrange} onPress={
              () => {
                const nextCardioType = NEXT_CARDIO_TYPE[cardioType];
                setCardioType(nextCardioType);
                props.handleCardioTypeChange(nextCardioType);
              }
            }>
              <Text color={TextColor.Orange} bold>Change</Text>
            </TouchableHighlight>
          }
      </View>
      <TouchableHighlight underlayColor={colors.white} onPress={() => {}}>
        <Card>
          <View style={styles.cardHeader}>
            <Heading3 color={HeadingColor.Black} style={styles.heading}>{props.isActiveSession ? props.activeSessionType : cardioType}</Heading3>
            <TouchableHighlight style={styles.durationButton} underlayColor={colors.orange} disabled={props.isActiveSession} onPress={
              () => {
                const updatedDuration = duration === 60 ? 10: duration + 10;
                setDuration(updatedDuration);
                props.handleDurationChange(updatedDuration);
              }
            }>
              <Text color={TextColor.Orange} bold>{duration} min</Text>
            </TouchableHighlight>
          </View>
          <View style={styles.cardioDetailContainer}>
            <Text color={TextColor.Black} style={styles.explanationText}>
              {props.isActiveSession ? CARDIO_TYPE_TO_DESC[props.activeSessionType] : CARDIO_TYPE_TO_DESC[cardioType]} Tap the time to increase the duration of your session. 
            </Text>
          </View>
          <View style={styles.buttonContainer}>
        <Button
          color={ButtonColor.Orange}
          size={ButtonSize.Small}
          text={(props.isActiveSession ? "Continue" : "Start") + " Session"}
          onPress={props.onPressStart}
          textSize={isSmallWidth ? 16 : 18}
        />
      </View>
        </Card>
      </TouchableHighlight>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginBottom: 20,
  },
  sessionHeader: {
    paddingLeft: 12,
    paddingRight: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeader: {
    paddingLeft: 8,
    paddingRight: 8,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: {
    alignSelf: 'center',
    height: 60,
  },
  durationButton: {
    backgroundColor: colors.lightOrange,
    width: 64,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  changeButton: {
    width: 64,
    height: 30,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  cardioDetailContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    marginTop: 16,
    paddingBottom: 20,
  },
  explanationText: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default CardioCard;
