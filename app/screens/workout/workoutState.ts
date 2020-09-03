import { createContext } from "react";
import PushNotificationIOS from "@react-native-community/push-notification-ios";
import assertNever from "app/utils/assertNever";
import { Exercise } from "app/endpoints/workout/workout";
import { EmitterSubscription } from "react-native";
import BackgroundTimer from 'app/utils/backgroundTimer';

interface TimerContextProps {
  timerState: TimerState;
  timerDispatch: (action: TimerAction) => void;
}

export const TimerContext = createContext({} as TimerContextProps);

export function getTimerKey(exercise: Exercise, index: number) {
  return `${exercise.exercise_name}-${index}`;
}

export type TimerState = {
  timers: Map<string, number>;
  emitter?: EmitterSubscription;
};

export enum TimerActionType {
  Initialize = 'Initialize',
  Decrement = 'Decrement',
  Reset = 'Reset',
  SetEmitter = 'SetEmitter',
  Clear = 'Clear',
};

export type TimerAction =
  | { type: TimerActionType.Initialize, timerKey: string, initialSeconds: number}
  | { type: TimerActionType.Decrement }
  | { type: TimerActionType.Reset, timerKey: string }
  | { type: TimerActionType.SetEmitter, emitter: EmitterSubscription }
  | { type: TimerActionType.Clear };

export const timerReducer = (state: TimerState, action: TimerAction) => {
  switch (action.type) {
    case TimerActionType.Initialize:
      const initializeTimers: Map<string, number> = new Map<string, number>();
      for (const [key, value] of state.timers) {
        initializeTimers.set(key, value);
      }
      initializeTimers.set(action.timerKey, action.initialSeconds);
      return {
        ...state,
        timers: initializeTimers,
      };
    case TimerActionType.Decrement:
      const newTimers: Map<string, number> = new Map<string, number>();
      let shouldShowPushNotification = false;
      for (const [key, value] of state.timers) {
        if (value === 1) {
          shouldShowPushNotification = true;
        } else {
          newTimers.set(key, value - 1);
        }
      }
      if (newTimers.size === 0) {
        if (state.emitter) {
          BackgroundTimer.clearInterval(state.emitter);
        }
      }
      if (shouldShowPushNotification) {
        PushNotificationIOS.presentLocalNotification({
          alertBody: 'Time to start your next set.',
        });
      }
      return {
        ...state,
        timers: newTimers,
      };
    case TimerActionType.Reset:
      const resetTimers: Map<string, number> = new Map<string, number>();
      for (const [key, value] of state.timers) {
        if (key !== action.timerKey) {
          resetTimers.set(key, value);
        }
      }
      if (resetTimers.size === 0) {
        if (state.emitter) {
          BackgroundTimer.clearInterval(state.emitter);
        }
      }
      return {
        ...state,
        timers: resetTimers,
      };
    case TimerActionType.SetEmitter:
      return {
        ...state,
        emitter: action.emitter,
      };
    case TimerActionType.Clear:
      if (state.emitter) {
        BackgroundTimer.clearInterval(state.emitter);
      }
      return {
        timers: new Map<string, number>(),
      };
    default:
      // TODO: Figure out why this is a lint error.
      assertNever(action.type);
  }
};