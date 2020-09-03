import { AsyncStorage } from "react-native";

export const getCalorieLogsRoute = 'progress/calories';

export type GetCalorieLogsResponse = Array<CalorieLog>;

export type CalorieLog = {
  logged_at: string;
  calories: string;
};

const calorieLogsKey = 'calorieLogsKey';
export const persistCalorieLogs = async(logs: GetCalorieLogsResponse) => {
  try {
    await AsyncStorage.setItem(calorieLogsKey, JSON.stringify(logs));
  } catch(e) {
    // save error
  }
}

export const getCachedCalorieLogs = async() => {
  try {
    const value = await AsyncStorage.getItem(calorieLogsKey);
    if (!value) {
      return null;
    }
    const wr: GetCalorieLogsResponse = JSON.parse(value);
    return wr;
  } catch(e) {
    // read error
  }
}

export const clearCachedCalorieLogs = async() => {
  try {
    await AsyncStorage.removeItem(calorieLogsKey);
  } catch(e) {
    // save error
  }
}