import React, { useState, useCallback, useContext } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'app/assets/colors';
import Text, { TextColor } from 'app/components/Text';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, WorkoutScreenFromScreen } from 'app/utils/routes';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Heading1, HeadingColor } from 'app/components/Headings';
import { prettyDate } from 'app/utils/datetime';
import WorkoutCard from 'app/screens/workout/WorkoutCard';
import {
  displayNameForWorkoutType,
  completeWorkoutSessionRoute,
  SetDetail,
  getCachedWorkoutSessionKey,
  persistWorkoutSession,
  clearCachedWorkoutResponse,
  clearCachedWorkoutSession,
  WorkoutSession,
  WorkoutLocation,
  GetCompletedWorkoutSessionsResponse,
  getCompletedWorkoutSessionsRoute,
  persistCompletedWorkoutSessions,
  MuscleGroup,
} from 'app/endpoints/workout/workout';
import { makeRequest } from 'app/utils/network';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import CompleteWorkoutModal from 'app/screens/workout/CompleteWorkoutModal';
import CompletionModal from 'app/screens/workout/CompletionModal';
import AbandonWorkoutModal from 'app/screens/workout/AbandonWorkoutModal';
import { clearCachedCalorieLogs } from 'app/endpoints/progress/calories';
import { getTimerKey, TimerContext, TimerActionType } from 'app/screens/workout/workoutState';
import BackgroundTimer from 'app/utils/backgroundTimer';
import assertNever from 'app/utils/assertNever';

const counterSize = 80;
const gymSecondsHeavy = 90;
const gymSeconds = 60;
const homeSeconds = 45;

type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Workout'>;
type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'Workout'>;

type WorkoutScreenProps = {
  navigation: WorkoutScreenNavigationProp;
  route: WorkoutScreenRouteProp;
};

const WorkoutScreen = (props: WorkoutScreenProps) => {
  const [workoutSession, setWorkoutSession] = useState<WorkoutSession | undefined>(props.route.params.completedWorkoutSession);
  const [isCompleteWorkoutModalOpen, setIsCompleteWorkoutModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isAbandonWorkoutModalOpen, setIsAbandonWorkoutModalOpen] = useState(false);
  const [isCompleteWorkoutModalLoading, setIsCompleteWorkoutModalLoading] = useState(true);
  const { timerState, timerDispatch } = useContext(TimerContext);
  const setAndCacheWorkoutSession = (ws: WorkoutSession) => {
    persistWorkoutSession(ws);
    setWorkoutSession(ws);
  }
  useFocusEffect(
    useCallback(() => {
      if (props.route.params.completedWorkoutSession) {
        return;
      }
      getCachedWorkoutSessionKey().then(wr => {
        if (wr) {
          return setWorkoutSession(wr);
        }
      }).catch(() => {
        // TODO(danielc): handle error
      })
    }, [])
  )
  if (!workoutSession) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.orange} />
      </View>
    );
  }
  const getOnPressSwap = (targetMuscleGroup: MuscleGroup, timerKey: string, exerciseIndex: number) => () => {
    props.navigation.navigate('RelatedExercises', {
      workoutSession: workoutSession,
      date: props.route.params.date,
      targetMuscleGroup: targetMuscleGroup,
      workoutSessionID: workoutSession.workout_session_id,
      exerciseIndex: exerciseIndex,
      timerKey: timerKey,
    });
  };
  const routine = workoutSession.workout_routine;
  const details = workoutSession.workout_details;
  const firstExerciseSeconds = routine.workout_location === WorkoutLocation.GYM ? gymSecondsHeavy : homeSeconds;
  const otherExerciseSeconds = routine.workout_location === WorkoutLocation.GYM ? gymSeconds : homeSeconds;
  const isComplete = !!props.route.params.completedWorkoutSession;
  const calculateCompleted = () => {
    return [
      workoutSession.workout_details.exercise_one.every(setDetail => setDetail.result_reps) ? 1 : 0,
      workoutSession.workout_details.exercise_two?.every(setDetail => setDetail.result_reps) ? 1 : 0,
      workoutSession.workout_details.exercise_three?.every(setDetail => setDetail.result_reps) ? 1 : 0,
      workoutSession.workout_details.exercise_four?.every(setDetail => setDetail.result_reps) ? 1 : 0,
      workoutSession.workout_details.exercise_five?.every(setDetail => setDetail.result_reps) ? 1 : 0,
      workoutSession.workout_details.exercise_six?.every(setDetail => setDetail.result_reps) ? 1 : 0,
    ].reduce((sum, current) => sum + current, 0)
  }
  const onCompleteWorkoutModalHide = () => {
    setIsCompletionModalOpen(true);
    makeRequest({
      method: 'POST',
      url: completeWorkoutSessionRoute,
      body: {
        workout_session_id: workoutSession.workout_session_id,
        workout_details: details,
      },
    }).then(() => {
      clearCachedWorkoutSession().then(() => {
        clearCachedWorkoutResponse().then(() => {
          clearCachedCalorieLogs().then(() => {
             // Fetch completed sessions.
            makeRequest<GetCompletedWorkoutSessionsResponse>({
              method: 'GET',
              url: getCompletedWorkoutSessionsRoute,
            }).then((resp: GetCompletedWorkoutSessionsResponse) => {
              timerDispatch({
                type: TimerActionType.Clear,
              });
              persistCompletedWorkoutSessions(resp);
              setIsCompleteWorkoutModalLoading(false);
            })
          })
        });
      })
    }).catch(() => {
      // TODO(danielc): handle error
    });
  }
  const onAbandonWorkoutModalHide = () => {
    clearCachedWorkoutSession().then(() => {
      timerDispatch({
        type: TimerActionType.Clear,
      });
      props.navigation.navigate('Exercise')
    });
  }
  const numExercises = 1 
    + (routine.exercise_two ? 1 : 0)
    + (routine.exercise_three ? 1 : 0)
    + (routine.exercise_four ? 1 : 0)
    + (routine.exercise_five ? 1 : 0)
    + (routine.exercise_six ? 1 : 0)
  const getOnInitialSetTrackerPress = (timerKey: string, seconds: number) => () => {
    const shouldStartTimer = timerState.timers.size === 0;
    timerDispatch({
      timerKey: timerKey,
      type: TimerActionType.Initialize,
      initialSeconds: seconds,
    });
    if (shouldStartTimer) {
      const timer = BackgroundTimer.setInterval(() => { 
        timerDispatch({
          type: TimerActionType.Decrement,
        });
      }, 1000);
      timerDispatch({
        type: TimerActionType.SetEmitter,
        emitter: timer,
      });
    }
  }
  const workoutCards = [
    <WorkoutCard
      key={1}
      isComplete={isComplete}
      exercise={routine.exercise_one}
      setDetails={details.exercise_one}
      onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
        ...workoutSession,
        workout_details: {
          ...details,
          exercise_one: setDetails,
        }
      })}
      showWeight={!routine.exercise_one.is_body_weight_exercise}
      onPressSwap={getOnPressSwap(routine.exercise_one.target_muscle_group, getTimerKey(routine.exercise_one, 1), 1)}
      timerKey={getTimerKey(routine.exercise_one, 1)}
      onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_one, 1), firstExerciseSeconds)}
    />,
    routine.exercise_two && details.exercise_two && (
      <WorkoutCard
        key={2}
        isComplete={isComplete}
        exercise={routine.exercise_two}
        setDetails={details.exercise_two}
        onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
          ...workoutSession,
          workout_details: {
            ...details,
            exercise_two: setDetails,
          }
        })}
        showWeight={!routine.exercise_two.is_body_weight_exercise}
        onPressSwap={getOnPressSwap(routine.exercise_two.target_muscle_group, getTimerKey(routine.exercise_two, 2), 2)}
        timerKey={getTimerKey(routine.exercise_two, 2)}
        onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_two, 2), otherExerciseSeconds)}
      />
    ),
    routine.exercise_three && details.exercise_three && (
      <WorkoutCard
        key={3}
        isComplete={isComplete}
        exercise={routine.exercise_three}
        setDetails={details.exercise_three}
        onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
          ...workoutSession,
          workout_details: {
            ...details,
            exercise_three: setDetails,
          }
        })}
        showWeight={!routine.exercise_three.is_body_weight_exercise}
        onPressSwap={getOnPressSwap(routine.exercise_three.target_muscle_group, getTimerKey(routine.exercise_three, 3), 3)}
        timerKey={getTimerKey(routine.exercise_three, 3)}
        onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_three, 3), otherExerciseSeconds)}
      />
    ),
    routine.exercise_four && details.exercise_four && (
      <WorkoutCard
        key={4}
        isComplete={isComplete}
        exercise={routine.exercise_four}
        setDetails={details.exercise_four}
        onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
          ...workoutSession,
          workout_details: {
            ...details,
            exercise_four: setDetails,
          }
        })}
        showWeight={!routine.exercise_four.is_body_weight_exercise}
        onPressSwap={getOnPressSwap(routine.exercise_four.target_muscle_group, getTimerKey(routine.exercise_four, 4), 4)}
        timerKey={getTimerKey(routine.exercise_four, 4)}
        onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_four, 4), otherExerciseSeconds)}
      />
    ),
    routine.exercise_five && details.exercise_five && (
      <WorkoutCard
        key={5}
        isComplete={isComplete}
        exercise={routine.exercise_five}
        setDetails={details.exercise_five}
        onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
          ...workoutSession,
          workout_details: {
            ...details,
            exercise_five: setDetails,
          }
        })}
        showWeight={!routine.exercise_five.is_body_weight_exercise}
        onPressSwap={getOnPressSwap(routine.exercise_five.target_muscle_group, getTimerKey(routine.exercise_five, 5), 5)}
        timerKey={getTimerKey(routine.exercise_five, 5)}
        onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_five, 5), otherExerciseSeconds)}
      />
    ),
    routine.exercise_six && details.exercise_six && (
      <WorkoutCard
        key={6}
        isComplete={isComplete}
        exercise={routine.exercise_six}
        setDetails={details.exercise_six}
        onChange={(setDetails: Array<SetDetail>) => setAndCacheWorkoutSession({
          ...workoutSession,
          workout_details: {
            ...details,
            exercise_six: setDetails,
          }
        })}
        showWeight={!routine.exercise_six.is_body_weight_exercise}
        onPressSwap={getOnPressSwap(routine.exercise_six.target_muscle_group, getTimerKey(routine.exercise_six, 6), 6)}
        timerKey={getTimerKey(routine.exercise_six, 6)}
        onInitialSetTrackerPress={getOnInitialSetTrackerPress(getTimerKey(routine.exercise_six, 6), otherExerciseSeconds)}
      />
    ),
  ];
  const onBack = () => {
    switch (props.route.params.fromScreen) {
    case WorkoutScreenFromScreen.Main:
    case WorkoutScreenFromScreen.RelatedExercises:
      return props.navigation.navigate('Exercise', {date: props.route.params.date});
    case WorkoutScreenFromScreen.Calendar:
      return props.navigation.navigate('Progress');
    default:
      assertNever(props.route.params.fromScreen);
    }
  }
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
    >
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.orange, '#ff8474']}
        style={styles.headerContainer}
      >
        <View style={styles.backButton}>
          <BackButton color={BackButtonColor.White} onPress={onBack}/>
        </View>
        <View style={styles.workoutHeader}>
          <View style={styles.heading}>
            <Heading1 color={HeadingColor.White}>{displayNameForWorkoutType(workoutSession.workout_routine.target_muscle_group)}</Heading1>
            <Text
              color={TextColor.White}
              style={{fontSize: 22}}
            >
              {prettyDate(props.route.params.date)}
            </Text>
          </View>
          <View style={styles.counter}>
            <Text color={TextColor.White} style={{fontSize: 18}}>{calculateCompleted()} / {numExercises}</Text>
          </View>
        </View>
      </LinearGradient>
      <View style={styles.cardContainer}>
        <View style={styles.workoutCards}>
          {workoutCards.map((w, i) => <View key={i} style={styles.card}>{w}</View>)}
        </View>
        {!props.route.params.completedWorkoutSession &&
          <View style={styles.buttonContainer}>
            <Button
              color={ButtonColor.Orange}
              size={ButtonSize.Medium}
              onPress={() => setIsCompleteWorkoutModalOpen(true)}
              text={'Finish Workout'}
              textBold
            />
            <TouchableWithoutFeedback
              onPress={() => setIsAbandonWorkoutModalOpen(true)}
              style={styles.abandonWorkoutContainer}
            >
              <Text bold color={TextColor.Orange} style={styles.abandonWorkoutText}>Abandon workout</Text>
            </TouchableWithoutFeedback>
          </View>
        }
      </View>
      <CompleteWorkoutModal
        isVisible={isCompleteWorkoutModalOpen}
        onClose={() => setIsCompleteWorkoutModalOpen(false)}
        onModalHide={onCompleteWorkoutModalHide}
      />
      <CompletionModal
        isVisible={isCompletionModalOpen}
        isLoading={isCompleteWorkoutModalLoading}
        onPressHome={() => setIsCompletionModalOpen(false)}
        onModalHide={() => props.navigation.navigate('Exercise')}
      />
      <AbandonWorkoutModal
        isVisible={isAbandonWorkoutModalOpen}
        onClose={() => setIsAbandonWorkoutModalOpen(false)}
        onModalHide={onAbandonWorkoutModalHide}
        workoutSessionID={workoutSession.workout_session_id}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  backButton: {
    paddingBottom: 12,
    paddingRight: 12,
    marginLeft: -6,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 40,
    paddingBottom: 120,
    paddingLeft: 20,
    paddingRight: 20,
  },
  workoutHeader: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heading: {
    display: 'flex',
    flexDirection: 'column',
  },
  counter: {
    borderColor: colors.white,
    borderWidth: 3,
    borderRadius: counterSize / 2,
    height: counterSize,
    width: counterSize,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  dateText: {
    fontSize: 22,
    marginTop: 12,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
  },
  workoutCards: {
    marginTop: -80,
  },
  card: {
    marginBottom: 24,
  },
  buttonContainer: {
    marginTop: -12,
    marginBottom: 60,
  },
  abandonWorkoutContainer: {
    marginTop: 18,
    marginBottom: 12,
  },
  abandonWorkoutText: {
    fontSize: 18,
    textAlign: 'center',
  }
});

export default WorkoutScreen;