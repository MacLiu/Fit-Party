import React from 'react';
import { View, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

import colors from 'app/assets/colors';
import Text from 'app/components/Text';
import Card from 'app/components/Card';
import { Heading35, HeadingColor } from 'app/components/Headings';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { displayNameForWorkoutType, WorkoutType, WorkoutLength, displayNameForWorkoutLength, displayNameWithTimeForWorkoutLength, workoutLengthForDisplayNameWithTime, CalorieRange } from 'app/endpoints/workout/workout';
import Dropdown from 'app/components/Dropdown';
import { TextColor } from 'app/components/Text';
import assertNever from 'app/utils/assertNever';

const counterSize = 60;

type AssesmentCardProps = {
  completedAssesments: number;
};

const AssesmentCard = (props: AssesmentCardProps) => {
  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.header}>
          <Heading35 color={HeadingColor.Orange}>You are in assessment mode</Heading35>
        </View>
        <View style={styles.assessmentDetailContainer}>
          <Text color={TextColor.Black} style={styles.explanationText}>
            Our algorithm will use the first 8 workout sessions to assess your performance and start optimizing your workouts.
          </Text>
          <View style={styles.counter}>
            <Text color={TextColor.Orange} style={{fontSize: 16}}>{props.completedAssesments} / 8</Text>
          </View>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  header: {
    paddingLeft: 8,
    paddingRight: 8,
  },
  counter: {
    borderColor: colors.orange,
    borderWidth: 3,
    borderRadius: counterSize / 2,
    height: counterSize,
    width: counterSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  assessmentDetailContainer: {
    paddingLeft: 8,
    paddingRight: 8,
    marginTop:10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  explanationText: {
    fontSize: 15,
    flex: 0.99,
  },
});

export default AssesmentCard;
