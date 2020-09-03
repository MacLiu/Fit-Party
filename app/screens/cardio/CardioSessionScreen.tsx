import React, { useReducer, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { TextInputSize } from 'app/components/form/TextInput';
import Text, { TextColor } from 'app/components/Text';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'app/utils/routes';
import { RouteProp } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'app/assets/colors';
import CardioSessionTimer from 'app/screens/cardio/CardioSessionTimer';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import { breakpoint375 } from 'app/utils/screenSize';
import BackgroundTimer from 'react-native-background-timer';
import CompleteWorkoutModal from 'app/screens/workout/CompleteWorkoutModal';
import CompletionModal from 'app/screens/workout/CompletionModal';
import {
  CardioSession,
  persistCardioSession,
  clearCachedCardioSession,
  completeCardioSessionRoute,
} from 'app/endpoints/workout/workout';
import { makeRequest } from 'app/utils/network';
import { clearCachedCalorieLogs } from 'app/endpoints/progress/calories';

const { height, width } = Dimensions.get('window');
const isSmallScreen = width < breakpoint375;

type CardioSessionNavigationProp = StackNavigationProp<RootStackParamList, 'Cardio'>;
type CardioSessionRouteProp = RouteProp<RootStackParamList, 'Cardio'>;

type CardioSessionScreenProps = {
  navigation: CardioSessionNavigationProp;
  route: CardioSessionRouteProp;
};

type TimerState = {
  timerSeconds: number;
  timerMinutes: number;
  running: boolean;
};

type TimerAction = {
  type: string;
};

const CardioScreen = (props: CardioScreenProps) => {
  const [isCompleteWorkoutModalOpen, setIsCompleteWorkoutModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isCompleteWorkoutModalLoading, setIsCompleteWorkoutModalLoading] = useState(true);
  const [timerStateText, setTimerStateText] = useState("Start");
  const timerReducer = (state: TimerState, action: TimerAction) => {
    switch (action.type) {
      case 'start':
        return { timerSeconds: state.timerSeconds, timerMinutes: state.timerMinutes, running: true };
      case 'decrement':
        let timerMinutes = state.timerMinutes;
        let timerSeconds = state.timerSeconds - 1;
        if (timerMinutes === 0 && timerSeconds === 0) {
          return { timerMinutes: 0, timerSeconds: 0, running: state.running };
        }
        if (timerSeconds < 0) {
          timerSeconds = 59;
          timerMinutes -= 1;
        }
        return { timerMinutes: timerMinutes, timerSeconds: timerSeconds, running: state.running };
      case 'pause':
        return { timerSeconds: state.timerSeconds, timerMinutes: state.timerMinutes, running: false };
      default:
        throw new Error();
    }
  }
  const [timerState, dispatch] = useReducer(
    timerReducer, 
    { timerMinutes: props.route.params.minutes, timerSeconds: props.route.params.seconds, running: false }
  );
  useEffect(() => {
    if (!timerState.running || (timerState.timerSeconds === 0 && timerState.timerMinutes === 0)) {
      BackgroundTimer.stopBackgroundTimer();
    } else {
      BackgroundTimer.stopBackgroundTimer();
      BackgroundTimer.runBackgroundTimer(() => { 
        dispatch({type: 'decrement'});
      }, 1000);
    }
  }, [timerState.timerMinutes, timerState.timerSeconds, timerState.running]);
  const onCompleteWorkoutModalHide = () => {
    setIsCompletionModalOpen(true);
    // console.log("MAC")
    // console.log(props.route.params.totalSessionDurationMinutes)
    // console.log(timerState.timerMinutes)
    const sessionTimeElapsed = props.route.params.totalSessionDurationMinutes - timerState.timerMinutes;
    makeRequest({
      method: 'POST',
      url: completeCardioSessionRoute,
      body: {
        duration_in_minutes: sessionTimeElapsed,
        type: props.route.params.type.toUpperCase(),
      },
    }).then(() => {
      clearCachedCardioSession().then(() => {
        clearCachedCalorieLogs();
      });
    }).catch((err) => {
      // console.log(err);
      // TODO(mac.liu): handle error
    });
    setIsCompleteWorkoutModalLoading(false)
  };
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.orange, '#ff8474']}
      style={styles.linearGradientContainer}
    >
      <View style={styles.backButton}>
        <BackButton color={BackButtonColor.White} onPress={() => {
          persistCardioSession({
            "durationMinutes": timerState.timerMinutes,
            "durationSeconds": timerState.timerSeconds,
            "type": props.route.params.type,
            "totalDurationMinutes": props.route.params.totalSessionDurationMinutes,
          })
          props.navigation.navigate('Exercise', {date: props.route.params.date})
        }}/>
      </View>
      <View style={styles.cardioSessionTimerContainer}>
        <CardioSessionTimer numMinutes={timerState.timerMinutes} numSeconds={timerState.timerSeconds} />
        <Text color={TextColor.White} style={styles.timerText}>Time Remaining</Text>
        <Button
          color={ButtonColor.Transparent}
          size={isSmallScreen ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            if (timerStateText == "Start") {
              setTimerStateText("Pause");
              dispatch({type: 'start'});
            } else {
              setTimerStateText("Start");
              dispatch({type: 'pause'});
            }
          }}
          text={timerStateText}
          textBold
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={ButtonColor.White}
          size={isSmallScreen ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => setIsCompleteWorkoutModalOpen(true)}
          text="Complete Session"
          textBold
        />
        <Button
          color={ButtonColor.Transparent}
          size={isSmallScreen ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            clearCachedCardioSession();
            props.navigation.navigate('Exercise', {date: props.route.params.date})
          }}
          text="Cancel"
          textBold
        />
      </View>
      <CompleteWorkoutModal
        isVisible={isCompleteWorkoutModalOpen}
        onClose={() => setIsCompleteWorkoutModalOpen(false)}
        onModalHide={onCompleteWorkoutModalHide}
        isCardio={true}
      />
      <CompletionModal
        isVisible={isCompletionModalOpen}
        isLoading={isCompleteWorkoutModalLoading}
        onPressHome={() => setIsCompletionModalOpen(false)}
        onModalHide={() => {
          clearCachedCardioSession();
          props.navigation.navigate('Exercise');
        }}
        isCardio
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  linearGradientContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 40,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'space-between',
  },
  backButton: {
    paddingBottom: 12,
    paddingRight: 12,
    marginLeft: -6,
  },
  timerText: {
    fontSize: 28,
    marginTop: 20,
  },
  cardioSessionTimerContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  buttonContainer: {
    display: 'flex',
    marginBottom: 36,
    marginLeft: 24,
    marginRight: 24,
  },
});

export default CardioScreen;
