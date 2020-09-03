import { SurveyResponses, Gender, Experience, TrainingGoal } from "app/utils/routes";
import { AsyncStorage } from "react-native";
import assertNever from "app/utils/assertNever";

export const userInfoRoute = 'user/account_data';
export type UpdateUserInfoResponse = {};
export type GetUserInfoResponse = {
  birth_date: string;
  gender: Gender;
  height_in_inches: number;
  name: string;
  training_experience: Experience;
  training_goal: TrainingGoal;
};

export const getDisplayNameForGender = (gender: Gender) => {
  return gender.charAt(0) + gender.substring(1).toLowerCase();
}

export const getGenderFromDisplayName = (gender: string) => {
  return gender.toUpperCase() as any as Gender;
}

export const getDisplayNameForHeight = (heightInInches: number) => {
  if (heightInInches % 12 === 0) {
    return `${Math.floor(heightInInches / 12)} ft`;
  }
  return `${Math.floor(heightInInches / 12)} ft ${heightInInches % 12} in`;
}

export const getHeightInchesForDisplayName = (height: string) => {
  const feet = parseInt(height.substring(0, height.indexOf(' ')));
  if (height.indexOf('in') === -1) {
    return feet * 12;
  }
  const inches = parseInt(height.substring(height.indexOf('t') + 2, height.lastIndexOf(' ')));
  return feet * 12 + inches;
}

export enum ExperienceDisplayName {
  NoExperience = 'No Experience',
  Beginner = 'Less than 1 year',
  Experienced = '1 - 3 years',
  Pro = '3+ years'
}

export const getDisplayNameForTrainingExperience = (experience: Experience) => {
  switch (experience) {
  case Experience.NoExperience:
    return ExperienceDisplayName.NoExperience;
  case Experience.Beginner:
    return ExperienceDisplayName.Beginner;
  case Experience.Experienced:
    return ExperienceDisplayName.Experienced;
  case Experience.Pro:
    return ExperienceDisplayName.Pro;
  default:
    assertNever(experience);
  }
}

export const getTrainingExperienceForDisplayName = (experience: ExperienceDisplayName) => {
  switch (experience) {
  case ExperienceDisplayName.NoExperience:
    return Experience.NoExperience;
  case ExperienceDisplayName.Beginner:
    return Experience.Beginner;
  case ExperienceDisplayName.Experienced:
    return Experience.Experienced;
  case ExperienceDisplayName.Pro:
    return Experience.Pro;
  default:
    assertNever(experience);
  }
}

export enum TrainingGoalDisplayName {
  MuscleGain = 'Muscle Gain',
  WeightLoss = 'Weight Loss',
  Recompisition = 'Recomposition (Both)',
}

export const getDisplayNameForTrainingGoal = (goal: TrainingGoal) => {
  switch (goal) {
  case TrainingGoal.MuscleGain:
    return TrainingGoalDisplayName.MuscleGain;
  case TrainingGoal.WeightLoss:
    return TrainingGoalDisplayName.WeightLoss;
  case TrainingGoal.Recompisition:
    return TrainingGoalDisplayName.Recompisition;
  default:
    assertNever(goal);
  }
}

export const getTrainingGoalForDisplayName = (goal: TrainingGoalDisplayName) => {
  switch (goal) {
  case TrainingGoalDisplayName.MuscleGain:
    return TrainingGoal.MuscleGain;
  case TrainingGoalDisplayName.WeightLoss:
    return TrainingGoal.WeightLoss;
  case TrainingGoalDisplayName.Recompisition:
    return TrainingGoal.Recompisition;
  default:
    assertNever(goal);
  }
}

export function isUserInfoSet(info: GetUserInfoResponse) {
  return !!info.birth_date && 
    !!info.gender && 
    !!info.height_in_inches &&
    !!info.name &&
    !!info.training_experience &&
    !!info.training_goal;
}

const userInfoKey = 'userInfoKey';
export const persistUserInfo = async(userInfo: SurveyResponses) => {
  try {
    await AsyncStorage.setItem(userInfoKey, JSON.stringify(userInfo));
  } catch(e) {
    // save error
  }
}

export const getCachedUserInfo = async() => {
  try {
    const value = await AsyncStorage.getItem(userInfoKey);
    if (!value) {
      return null;
    }
    const info: SurveyResponses = JSON.parse(value);
    return info;
  } catch(e) {
    // read error
  }
}
