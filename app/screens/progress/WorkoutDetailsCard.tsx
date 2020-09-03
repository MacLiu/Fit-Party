import React, { useMemo } from 'react';
import Card from "app/components/Card";
import { WorkoutSession, displayNameForWorkoutType } from "app/endpoints/workout/workout";
import { Heading35, HeadingColor } from "app/components/Headings";
import { prettyDate } from "app/utils/datetime";
import Text, { TextColor } from 'app/components/Text';
import { StyleSheet, View, Dimensions } from 'react-native';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';

const { width } = Dimensions.get('window');

type WorkoutDetailsCardProps = {
  workoutSession: WorkoutSession;
  caloriesBurned: number;
  onPress: () => void;
};

const WorkoutDetailsCard = (props: WorkoutDetailsCardProps) => {
  return (
    <Card>
      <View style={styles.cardContent}>
        <View style={styles.headingContainer}>
          <Heading35 color={HeadingColor.Black}>{prettyDate(new Date(props.workoutSession.completed_at))}</Heading35>
        </View>
        <View style={styles.row}>
          <Text color={TextColor.Orange} style={styles.rowText}>Workout: </Text>
          <Text style={styles.rowText}>{displayNameForWorkoutType(props.workoutSession.workout_routine.target_muscle_group)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowText} color={TextColor.Orange}>Calories Burned:</Text>
          <Text style={styles.rowText}>{props.caloriesBurned}</Text>
        </View>
        {/* TODO: Implement weight lifted */}
        <View style={styles.buttonContainer}>
          <Button
            color={ButtonColor.Orange}
            size={ButtonSize.Small}
            text={'View workout'}
            onPress={props.onPress}
            textBold
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  cardContent: {
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 18,
    paddingRight: 12,
  },
  headingContainer: {
    marginBottom: 12,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  rowText: {
    fontSize: 18, 
  },
  buttonContainer: {
    paddingLeft: width * .1,
    paddingRight: width * .1,
    marginTop: 6,
  }
});

export default WorkoutDetailsCard;
