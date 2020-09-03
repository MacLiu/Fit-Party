import React, { useCallback, useEffect, useState, useContext } from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList, WorkoutScreenFromScreen } from 'app/utils/routes';
import { HeadingColor, Heading2 } from 'app/components/Headings';
import { makeRequest } from 'app/utils/network';
import { GetRelatedExercisesResponse, getRelatedExercisesRoute, Exercise, CustomizeSessionResponse, customizeSessionRoute, persistWorkoutSession } from 'app/endpoints/workout/workout';
import colors from 'app/assets/colors';
import RelatedExerciseRow from 'app/screens/workout/RelatedExerciseRow';
import { TimerContext, TimerActionType } from 'app/screens/workout/workoutState';

type RelatedExercisesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'RelatedExercises'>;
type RelatedExercisesScreenRouteProp = RouteProp<RootStackParamList, 'RelatedExercises'>;

type RelatedExercisesScreenProps = {
  navigation: RelatedExercisesScreenNavigationProp;
  route: RelatedExercisesScreenRouteProp;
};

const { width, height } = Dimensions.get('window');

const RelatedExercisesScreen = (props: RelatedExercisesScreenProps) => {
  const [relatedExercises, setRelatedExercises] = useState<Array<Exercise> | undefined>(undefined);
  const { timerDispatch } = useContext(TimerContext);
  const onPressBack = useCallback(() => {
    props.navigation.navigate('Workout', {
      date: props.route.params.date,
      fromScreen: WorkoutScreenFromScreen.RelatedExercises,
    });
  }, []);
  const getOnSelectExercise = (exercise: Exercise) => () => {
    const body: any = {
      workout_session_id: props.route.params.workoutSessionID,
    };
    switch (props.route.params.exerciseIndex) {
    case 1:
      body.new_exercise_one = exercise.id;
      break;
    case 2:
      body.new_exercise_two = exercise.id;
      break;
    case 3:
      body.new_exercise_three = exercise.id;
      break;
    case 4:
      body.new_exercise_four = exercise.id;
      break;
    case 5:
      body.new_exercise_five = exercise.id;
      break;
    case 6:
      body.new_exercise_six = exercise.id;
      break;
    default:
      // TODO: handle error
    }
    makeRequest<CustomizeSessionResponse>({
      method: 'POST',
      url: customizeSessionRoute,
      body: body,
    }).then((resp: CustomizeSessionResponse) => {
      const workoutRoutine = {...props.route.params.workoutSession.workout_routine};
      const workoutDetails = {...props.route.params.workoutSession.workout_details};
      switch (props.route.params.exerciseIndex) {
        case 1:
          workoutRoutine.exercise_one = resp.workout_routine.exercise_one;
          workoutDetails.exercise_one = resp.workout_details.exercise_one;
          break;
        case 2:
          workoutRoutine.exercise_two = resp.workout_routine.exercise_two;
          workoutDetails.exercise_two = resp.workout_details.exercise_two;
          break;
        case 3:
          workoutRoutine.exercise_three = resp.workout_routine.exercise_three;
          workoutDetails.exercise_three = resp.workout_details.exercise_three;
          break;
        case 4:
          workoutRoutine.exercise_four = resp.workout_routine.exercise_four;
          workoutDetails.exercise_four = resp.workout_details.exercise_four;
          break;
        case 5:
          workoutRoutine.exercise_five = resp.workout_routine.exercise_five;
          workoutDetails.exercise_five = resp.workout_details.exercise_five;
          break;
        case 6:
          workoutRoutine.exercise_six = resp.workout_routine.exercise_six;
          workoutDetails.exercise_six = resp.workout_details.exercise_six;
          break;
        default:
          // TODO: handle error
      }
      persistWorkoutSession({
        ...props.route.params.workoutSession,
        workout_routine: workoutRoutine,
        workout_details: workoutDetails,
      });
      timerDispatch({
        timerKey: props.route.params.timerKey,
        type: TimerActionType.Reset,
      });
      props.navigation.navigate('Workout', {
        date: props.route.params.date,
        fromScreen: WorkoutScreenFromScreen.RelatedExercises,
      });
    }).catch(() => {
      // TODO(danielc): handle error
    });
  };
  useEffect(() => {
    makeRequest<GetRelatedExercisesResponse>({
      method: 'POST',
      url: getRelatedExercisesRoute,
      body: {
        target_muscle_group: props.route.params.targetMuscleGroup,
      },
    }).then((resp: GetRelatedExercisesResponse) => {
      resp.sort((a: Exercise, b: Exercise) => {
        const textA = a.exercise_name.toUpperCase();
        const textB = b.exercise_name.toUpperCase();
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
      });
      setRelatedExercises(resp);
    }).catch(() => {
      // TODO(danielc): handle error
    });
  }, [])
  let content;
  if (!relatedExercises) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    )
  } else {
    const exerciseRows = relatedExercises.map((exercise, i) => {
      return (
        <View style={styles.rowContainer} key={`${exercise.exercise_name}-${i}`}>
          <RelatedExerciseRow
            exercise={exercise}
            onSelectExercise={getOnSelectExercise(exercise)}
          />
        </View>
      );
    });
    content = <View style={styles.exerciseRows}>{exerciseRows}</View>;
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.backButton}>
        <BackButton color={BackButtonColor.Orange} onPress={onPressBack}/>
      </View>
      <View style={styles.headingContainer}>
        <Heading2 color={HeadingColor.Orange} center bold>Alternate Exercises</Heading2>
      </View>
      {content}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.white,
  },
  backButton: {
    paddingTop: height * .075,
    paddingLeft: width * .075,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingContainer: {
    marginTop: height * .025,
    marginBottom: height * .025,
  },
  exerciseRows: {
    display: 'flex',
    flexDirection: 'column',
    paddingBottom: 50,
  },
  rowContainer: {
    paddingLeft: width * .075,
    paddingRight: width * .075,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomColor: colors.borderGray,
    borderBottomWidth: 1,
  },
});

export default RelatedExercisesScreen;
