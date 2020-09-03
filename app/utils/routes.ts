import { WorkoutType, WorkoutLocation, WorkoutLength, WorkoutSession, MuscleGroup } from "app/endpoints/workout/workout";

export type RootStackParamList = {
  Loading: undefined;
  Auth: undefined;
  Login: undefined;
  SignUp: undefined;
  Confirmation: ConfirmationScreenParams;
  ForgotPassword: undefined;
  PasswordResetConfirmation: PasswordResetConfirmationScreenParams;
  PasswordReset: PasswordResetScreenParams;
  Home: undefined;
  Exercise: MainScreenParams;
  Workout: WorkoutScreenParams;
  RelatedExercises: RelatedExercisesScreenParams;
  Progress: undefined;
  Cardio: undefined;
  Onboarding: undefined;
  NameSurvey: undefined;
  AgeSurvey: SurveyParams;
  WeightSurvey: SurveyParams;
  HeightSurvey: SurveyParams;
  ExperienceSurvey: SurveyParams;
  FocusSurvey: SurveyParams;
};

type ConfirmationScreenParams = {
  authyID: string;
};

type PasswordResetConfirmationScreenParams = {
  authyID: string;
  phoneNumber: string;
};

type PasswordResetScreenParams = {
  phoneNumber: string;
};

type MainScreenParams = {
  date?: Date;
};

export enum WorkoutScreenFromScreen {
  Main = 'Main',
  Calendar = 'Calendar',
  RelatedExercises = 'RelatedExercises',
};

type WorkoutScreenParams = {
  date: Date;
  completedWorkoutSession?: WorkoutSession;
  fromScreen: WorkoutScreenFromScreen;
};

type RelatedExercisesScreenParams = {
  workoutSession: WorkoutSession
  date: Date;
  targetMuscleGroup: MuscleGroup;
  workoutSessionID: string;
  exerciseIndex: number;
  timerKey: string;
};

export enum Gender {
  Male = 'MALE',
  Female = 'FEMALE',
}

export enum Experience {
  NoExperience = 'NO_EXPERIENCE',
  Beginner = 'BEGINNER',
  Experienced = 'EXPERIENCED',
  Pro = 'PRO', 
}

export enum TrainingGoal {
  WeightLoss = 'WEIGHT_LOSS',
  MuscleGain = 'MUSCLE_GAIN',
  Recompisition = 'RECOMPOSITION',
}

export type SurveyResponses = {
  name: string | null;
  gender: Gender | null;
  weightPounds: number | null;
  heightInches: number | null;
  experience: Experience | null;
  birthday: Date | null;
  trainingGoal: TrainingGoal | null;
}

export type SurveyParams = {
  surveyResponses: SurveyResponses;
};
