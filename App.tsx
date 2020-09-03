import React, { useEffect, useState, useReducer } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import MainScreen from 'app/screens/main/MainScreen';
import OnboardingScreen from 'app/screens/onboarding/OnboardingScreen';
import NameScreen from 'app/screens/survey/NameScreen';
import AgeScreen from 'app/screens/survey/AgeScreen';
import WeightScreen from 'app/screens/survey/WeightScreen';
import HeightScreen from 'app/screens/survey/HeightScreen';
import ExperienceScreen from 'app/screens/survey/ExperienceScreen';
import FocusScreen from 'app/screens/survey/FocusScreen';
import AuthScreen from 'app/screens/login/AuthScreen';
import LoginScreen from 'app/screens/login/LoginScreen';
import SignUpScreen from 'app/screens/login/SignUpScreen';
import ConfirmationScreen from 'app/screens/login/ConfirmationScreen';
import { RootStackParamList } from 'app/utils/routes';
import WorkoutScreen from 'app/screens/workout/WorkoutScreen';
import CardioScreen from 'app/screens/cardio/CardioSessionScreen';
import { getCachedAccessToken, deleteToken, makeRequest } from 'app/utils/network';
import { GetUserInfoResponse, userInfoRoute, isUserInfoSet } from 'app/endpoints/user/user';
import LoadingScreen from 'app/screens/login/LoadingScreen';
import { clearCachedWorkoutSession, clearCachedWorkoutResponse, clearCachedCompletedWorkoutSessions } from 'app/endpoints/workout/workout';
import ProgressScreen from 'app/screens/main/ProgressScreen';
import colors from 'app/assets/colors';
import { StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import SettingsScreen from 'app/screens/settings/SettingsScreen';
import RelatedExercisesScreen from 'app/screens/workout/RelatedExercisesScreen';
import { timerReducer, TimerContext } from 'app/screens/workout/workoutState';
import CalendarScreen from 'app/screens/progress/CalendarScreen';
import ForgotPasswordScreen from 'app/screens/login/ForgotPasswordScreen';
import PasswordResetConfirmationScreen from 'app/screens/login/PasswordResetConfirmationScreen';
import PasswordResetScreen from 'app/screens/login/PasswordResetScreen';

const { width } = Dimensions.get('window');

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

PushNotification.configure({
  // (optional) Called when Token is generated (iOS and Android)
  onRegister: function (token) {
  },
 
  // (required) Called when a remote is received or opened, or local notification is opened
  onNotification: function (notification) {
 
    // process the notification
 
    // (required) Called when a remote is received or opened, or local notification is opened
    notification.finish(PushNotificationIOS.FetchResult.NoData);
  },
 
  // IOS ONLY (optional): default: all - Permissions to register.
  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },
 
  // Should the initial notification be popped automatically
  // default: true
  popInitialNotification: true,
 
  /**
   * (optional) default: true
   * - Specified if permissions (ios) and token (android and ios) will requested or not,
   * - if not, you must call PushNotificationsHandler.requestPermissions() later
   * - if you are not using remote notification or do not have Firebase installed, use this:
   *     requestPermissions: Platform.OS === 'ios'
   */
  requestPermissions: true,
});

enum TabName {
  Exercise = 'Exercise',
  Progress = 'Progress',
  Settings = 'Settings',
}

const Home = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        activeTintColor: colors.orange,
        inactiveTintColor: colors.gray,
        showLabel: false,
        style: styles.tabStyle,
      }}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case TabName.Exercise:
              if (focused) {
                return <FastImage source={require('app/assets/images/main/workoutOrange.png')} style={styles.tabIcon}/>;
              }
              return <FastImage source={require('app/assets/images/main/workoutGrey.png')} style={styles.tabIcon} />;
            case TabName.Progress:
              if (focused) {
                return <FastImage source={require('app/assets/images/main/progressOrange.png')} style={styles.tabIcon} />;
              }
              return <FastImage source={require('app/assets/images/main/progressGrey.png')} style={styles.tabIcon} />;
            case TabName.Settings:
              if (focused) {
                return <FastImage source={require('app/assets/images/main/settingsOrange.png')} style={styles.tabIcon} />;
              }
              return <FastImage source={require('app/assets/images/main/settingsGrey.png')} style={styles.tabIcon} />;
            default:
              // no-op
            }
        },
      })}
    >
      <Tab.Screen name={TabName.Exercise} component={MainScreen} />
      <Tab.Screen name={TabName.Progress} component={CalendarScreen} />
      <Tab.Screen name={TabName.Settings} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [hasCompletedSurvey, setHasCompletedSurvey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [timerState, timerDispatch] = useReducer(timerReducer, {
    timers: new Map<string, number>(),
  });
  useEffect(() => {
    // deleteToken().then(() => {
      // clearCachedWorkoutResponse().then(() => {
      // clearCachedWorkoutSession().then(() => {
      // clearCachedCompletedWorkoutSessions().then(() => {
      getCachedAccessToken().then((token: string | null | undefined) => {
        if (token) {
          makeRequest<GetUserInfoResponse>({
            method: 'GET',
            url: userInfoRoute,
          }).then((resp: GetUserInfoResponse) => {
            if (isUserInfoSet(resp)) {
              setHasCompletedSurvey(true);
            }
            setIsSignedIn(true);
            setIsLoading(false);
          }).catch(() => {
            // TODO(danielc): handle error
          });
        } else {
          setIsLoading(false);
        }
      });
  //   })
  // })
  //   })
  // })
  }, []);
  useEffect(() => {
    SplashScreen.hide();
  }, [isLoading])
  let screens = [];
  if (isLoading) {
    screens.push(<Stack.Screen key="loading" name="Loading" component={LoadingScreen}/>,)
  }
  if (!isSignedIn) {
    screens.push([
      <Stack.Screen key="auth" name="Auth" component={AuthScreen}/>,
      <Stack.Screen key="login" name="Login" component={LoginScreen}/>,
      <Stack.Screen key="signup" name="SignUp" component={SignUpScreen}/>,
      <Stack.Screen key="confirmation" name="Confirmation" component={ConfirmationScreen}/>,
      <Stack.Screen key="forgotPassword" name="ForgotPassword" component={ForgotPasswordScreen}/>,
      <Stack.Screen key="passwordResetConfirmation" name="PasswordResetConfirmation" component={PasswordResetConfirmationScreen}/>,
      <Stack.Screen key="passwordReset" name="PasswordReset" component={PasswordResetScreen}/>,
    ]);
  }
  if (!hasCompletedSurvey) {
    screens.push([
      <Stack.Screen key="nameSurvey" name="NameSurvey" component={NameScreen} options={{gestureEnabled: false}} />,
      <Stack.Screen key="ageSurvey" name="AgeSurvey" component={AgeScreen} />,
      <Stack.Screen key="weightSurvey" name="WeightSurvey" component={WeightScreen} />,
      <Stack.Screen key="heightSurvey" name="HeightSurvey" component={HeightScreen} />,
      <Stack.Screen key="experienceSurvey" name="ExperienceSurvey" component={ExperienceScreen} />,
      <Stack.Screen key="focusSurvey" name="FocusSurvey" component={FocusScreen} />,
    ]);
  }
  return (
    <TimerContext.Provider value={{ timerState, timerDispatch }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false
          }}
        >
          {screens}
          <Stack.Screen key="home" name="Home" component={Home} options={{gestureEnabled: false}} />
          <Stack.Screen key="workout" name="Workout" component={WorkoutScreen} />
          <Stack.Screen key="RelatedExercises" name="RelatedExercises" component={RelatedExercisesScreen} />
          <Stack.Screen key="cardio" name="Cardio" component={CardioScreen} />
          <Stack.Screen key="onboarding" name="Onboarding" component={OnboardingScreen} options={{gestureEnabled: false}} />
        </Stack.Navigator>
      </NavigationContainer>
    </TimerContext.Provider>
  );
};

const styles = StyleSheet.create({
  tabStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    height: width * .07,
    width: width * .07,
    marginTop: 3,
  },
});

export default App;
