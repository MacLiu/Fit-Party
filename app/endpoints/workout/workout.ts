import assertNever from 'app/utils/assertNever';
import { AsyncStorage } from 'react-native';

export type Exercise = {
  id: string,
  exercise_name: string,
  image_url_path: string,
  is_body_weight_exercise: boolean,
  target_muscle_group: MuscleGroup,
};

export enum MuscleGroup {
  CHEST = 'CHEST',
  BACK = 'BACK',
  LEGS = 'LEGS',
  SHOULDER = 'SHOULDER',
  BICEPS = 'BICEPS',
  TRICEPS = 'TRICEPS',
  ABS = 'ABS',
};

export const baseExerciseImageURLPath = 'https://storage.googleapis.com/evolveai.appspot.com';

export enum WorkoutType {
  CHEST = 'CHEST',
  BACK = 'BACK',
  LEGS = 'LEGS',
  SHOULDER = 'SHOULDER',
  ARMS = 'ARMS',
  PUSH = 'PUSH',
  PULL = 'PULL',
  UPPER = 'UPPER',
  LOWER = 'LOWER',
  SHOULDER_TRICEPS = 'SHOULDER_TRICEPS',
  BACK_BICEPS ='BACK_BICEPS',
}

export const displayNameForWorkoutType = (wt: WorkoutType) => {
  switch (wt) {
  case WorkoutType.CHEST:
    return 'Chest';
  case WorkoutType.BACK:
    return 'Back';
  case WorkoutType.LEGS:
    return 'Legs';
  case WorkoutType.SHOULDER:
    return 'Shoulders';
  case WorkoutType.ARMS:
    return 'Arms';
  case WorkoutType.PUSH:
    return 'Push';
  case WorkoutType.PULL:
    return 'Pull';
  case WorkoutType.UPPER:
    return 'Upper Body';
  case WorkoutType.LOWER:
    return 'Lower Body';
  case WorkoutType.SHOULDER_TRICEPS:
    return 'Shoulders/Triceps';
  case WorkoutType.BACK_BICEPS:
    return 'Back/Biceps';
  default:
    assertNever(wt);
  }
}

export enum WorkoutLocation {
  HOME = 'HOME',
  GYM = 'GYM',
}

export const displayNameForWorkoutLocation = (wl: WorkoutLocation) => {
  switch (wl) {
  case WorkoutLocation.HOME:
    return 'Home';
  case WorkoutLocation.GYM:
    return 'Gym';
  default:
    assertNever(wl);
  }
}

export enum WorkoutLength {
  SHORT = 'SHORT',
  MEDIUM = 'MEDIUM',
  LONG = 'LONG',
}

export const displayNameForWorkoutLength = (wl: WorkoutLength) => {
  let displayName = wl.toLowerCase()
  return displayName[0].toUpperCase() + displayName.slice(1);
  // switch (wl) {
  // case WorkoutLength.SHORT:
  //   return 'Short';
  // case WorkoutLength.MEDIUM:
  //   return 'Medium';
  // case WorkoutLength.LONG:
  //   return 'Long';
  // default:
  //   assertNever(wl);
  // }
}

export const displayNameWithTimeForWorkoutLength = (wl: WorkoutLength) => {
  const displayName = wl.toLowerCase()
  const displayNameUpper = displayName[0].toUpperCase() + displayName.slice(1);
  switch (wl) {
  case WorkoutLength.SHORT:
    return displayNameUpper + ' (30 min)';
  case WorkoutLength.MEDIUM:
    return displayNameUpper + ' (45 min)';
  case WorkoutLength.LONG:
    return displayNameUpper + ' (1 hr)';
  default:
    assertNever(wl);
  }
}

export const workoutLengthForDisplayNameWithTime = (wl: string) => {
  return workoutLengthForDisplayName(wl.substring(0, wl.indexOf(' ')));
}

export const workoutLengthForDisplayName = (wl: string) => {
  return wl.toUpperCase() as any as WorkoutLength;
}

export type WorkoutRoutine = {
  target_muscle_group: WorkoutType;
  workout_location: WorkoutLocation;
  workout_length: WorkoutLength;
  exercise_one: Exercise;
  exercise_two?: Exercise;
  exercise_three?: Exercise;
  exercise_four?: Exercise;
  exercise_five?: Exercise;
  exercise_six?: Exercise;
};

export type SetDetail = {
  reps: number;
  one_rep_max_percentage: number;
  weight: number;
  result_reps: number;
  result_weight: number;
};

export type WorkoutDetails = {
  exercise_one: Array<SetDetail>;
  exercise_two?: Array<SetDetail>;
  exercise_three?: Array<SetDetail>;
  exercise_four?: Array<SetDetail>;
  exercise_five?: Array<SetDetail>;
  exercise_six?: Array<SetDetail>;
}

export const getWorkoutSessionRoute = 'workout/session';
export type GetWorkoutSessionResponse = {
  has_active_session: boolean;
  default_workout_location: WorkoutLocation;
  default_workout_length: WorkoutLength;
  home_target_muscle_group: WorkoutType;
  gym_target_muscle_group: WorkoutType;
  is_completed: boolean;
  estimated_calories?: EstimatedCalories;
};

export const getWorkoutSessionV2Route = 'workout/session_v2';
export type GetWorkoutSessionV2Response = Array<WorkoutSession>;

export const getRelatedExercisesRoute = 'workout/related_exercises';
export type GetRelatedExercisesResponse = Array<Exercise>;

export const customizeSessionRoute = 'workout/customize_session';
export type CustomizeSessionResponse = WorkoutSession;

export type CalorieRange = string;

export type CalorieRanges = {
  short: CalorieRange;
  medium: CalorieRange;
  long: CalorieRange;
};

export type EstimatedCalories = {
  gym: CalorieRanges;
  home: CalorieRanges;
};

export const getCalorieRange = (range: CalorieRange) => {
  return [
    parseInt(range.substring(0, range.indexOf(' '))),
    parseInt(range.substring(range.lastIndexOf(' '))),
  ];
}

export type WorkoutSession = {
  workout_session_id: string;
  workout_routine: WorkoutRoutine;
  is_completed: boolean;
  workout_details: WorkoutDetails;
  completed_at: string;
  estimated_calories_burned: string;
};

export const completeWorkoutSessionRoute = 'workout/complete_session';

export const getCompletedWorkoutSessionsRoute = 'workout/completed_sessions';
export type GetCompletedWorkoutSessionsResponse = {
  completed_sessions: Array<WorkoutSession>;
};

export const completeCardioSessionRoute = 'workout/cardio_session';

/* WORKOUT SESSION V2 */
const possibleWorkoutSessionsKey = 'possibleWorkoutSessionsKey';
export const persistPossibleWorkoutSessions = async(w: Array<WorkoutSession>) => {
  try {
    await AsyncStorage.setItem(possibleWorkoutSessionsKey, JSON.stringify(w));
  } catch(e) {
    // save error
  }
}

export const getCachedPossibleWorkoutSessions = async() => {
  try {
    const value = await AsyncStorage.getItem(possibleWorkoutSessionsKey);
    if (!value) {
      return null;
    }
    const wr: Array<WorkoutSession> = JSON.parse(value);
    return wr;
  } catch(e) {
    // read error
  }
}

export const clearCachedPossibleWorkoutSessions = async() => {
  try {
    await AsyncStorage.removeItem(possibleWorkoutSessionsKey);
  } catch(e) {
    // save error
  }
}
/* END WORKOUT SESSION V2 */

/* WORKOUT SESSION V1 (DEPRECATED) */
const workoutResponseKey = 'workoutResponseKey';
export const persistWorkoutResponse = async(wr: GetWorkoutSessionResponse) => {
  try {
    await AsyncStorage.setItem(workoutResponseKey, JSON.stringify(wr));
  } catch(e) {
    // save error
  }
}

export const getCachedWorkoutResponse = async() => {
  try {
    const value = await AsyncStorage.getItem(workoutResponseKey);
    if (!value) {
      return null;
    }
    const wr: GetWorkoutSessionResponse = JSON.parse(value);
    return wr;
  } catch(e) {
    // read error
  }
}

export const clearCachedWorkoutResponse = async() => {
  try {
    await AsyncStorage.removeItem(workoutResponseKey);
  } catch(e) {
    // save error
  }
}
/* END WORKOUT SESSION V1 (DEPRECATED) */

const workoutSessionKey = 'workoutSessionKey';
export const persistWorkoutSession = async(wr: WorkoutSession) => {
  try {
    await AsyncStorage.setItem(workoutSessionKey, JSON.stringify(wr));
  } catch(e) {
    // save error
  }
}

export const getCachedWorkoutSessionKey = async() => {
  try {
    const value = await AsyncStorage.getItem(workoutSessionKey);
    if (!value) {
      return null;
    }
    const wr: WorkoutSession = JSON.parse(value);
    return wr;
  } catch(e) {
    // read error
  }
}

export const clearCachedWorkoutSession = async() => {
  try {
    await AsyncStorage.removeItem(workoutSessionKey);
  } catch(e) {
    // save error
  }
}

const completedWorkoutSessionsKey = 'completedWorkoutSessionsKey';
export const persistCompletedWorkoutSessions = async(wr: GetCompletedWorkoutSessionsResponse) => {
  try {
    await AsyncStorage.setItem(completedWorkoutSessionsKey, JSON.stringify(wr));
  } catch(e) {
    // save error
  }
}

export const getCachedCompletedWorkoutSessions = async() => {
  try {
    const value = await AsyncStorage.getItem(completedWorkoutSessionsKey);
    if (!value) {
      return null;
    }
    const wr: GetCompletedWorkoutSessionsResponse = JSON.parse(value);
    return wr;
  } catch(e) {
    // read error
  }
}

export const clearCachedCompletedWorkoutSessions = async() => {
  try {
    await AsyncStorage.removeItem(completedWorkoutSessionsKey);
  } catch(e) {
    // save error
  }
}

export const abandonWorkoutRoute = 'workout/abandon_session';
export type AbandonWorkoutSessionsResponse = {};


/* ################ CARDIO ################ */


export type CardioSession = {
  type: string;
  durationMinutes: number;
  durationSeconds: number;
  totalSessionDurationMinutes: number;
};

const activeCardioSessionKey = 'activeCardioSessionKey';
export const persistCardioSession = async(cs: CardioSession) => {
  try {
    await AsyncStorage.setItem(activeCardioSessionKey, JSON.stringify(cs));
  } catch(e) {
    // save error
  }
}

export const getCachedActiveCardioSessionKey = async() => {
  try {
    const value = await AsyncStorage.getItem(activeCardioSessionKey);
    if (!value) {
      return null;
    }
    const cs: CardioSession = JSON.parse(value);
    return cs;
  } catch(e) {
    // read error
  }
}

export const clearCachedCardioSession = async() => {
  try {
    await AsyncStorage.removeItem(activeCardioSessionKey);
  } catch(e) {
    // save error
  }
}
