import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Image, ActivityIndicator, Dimensions } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'app/assets/colors';
import WeekCalendar from 'app/screens/main/WeekCalendar';
import { Heading4, HeadingColor } from 'app/components/Headings';
import Text, { TextColor } from 'app/components/Text';
import AssesmentCard from 'app/screens/main/AssesmentCard';
import CardioCard from 'app/screens/main/CardioCard';
import StartWorkoutCard, { StartWorkoutCardStatus } from 'app/screens/main/StartWorkoutCard';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, WorkoutScreenFromScreen } from 'app/utils/routes';
import assertNever from 'app/utils/assertNever';
import { makeRequest, NetworkError } from 'app/utils/network';
import {
  WorkoutType,
  WorkoutLocation,
  WorkoutLength,
  displayNameForWorkoutLocation,
  getCachedWorkoutResponse,
  getCompletedWorkoutSessionsRoute,
  GetCompletedWorkoutSessionsResponse,
  WorkoutSession,
  getCachedCompletedWorkoutSessions,
  persistCompletedWorkoutSessions,
  CardioSession,
  getCachedActiveCardioSessionKey,
  getWorkoutSessionV2Route,
  GetWorkoutSessionV2Response,
  getCachedWorkoutSessionKey,
  persistPossibleWorkoutSessions,
  persistWorkoutSession,
} from 'app/endpoints/workout/workout';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { getUTCDate, prettyDateSlashes } from 'app/utils/datetime';
import { breakpoint375 } from 'app/utils/screenSize';
import Swiper from 'react-native-swiper';
import Carousel from 'react-native-snap-carousel';

type WorkoutScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Exercise'>;
type WorkoutScreenRouteProp = RouteProp<RootStackParamList, 'Exercise'>;

type MainScreenProps = {
  navigation: WorkoutScreenNavigationProp;
  route: WorkoutScreenRouteProp;
};

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;
const horizontalPadding = 26;

const MainScreen: React.FC<MainScreenProps> = props => {
  const [possibleWorkoutSessions, setPossibleWorkoutSessions] = useState<Array<WorkoutSession> | undefined>();
  const [completedWorkoutSessions, setCompletedWorkoutSessions] = useState<Array<WorkoutSession> | undefined>(undefined);
  const [currentWorkoutSession, setCurrentWorkoutSession] = useState<WorkoutSession | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  
  const [workoutLocation, setWorkoutLocation] = useState(WorkoutLocation.GYM);
  const [workoutLength, setWorkoutLength] = useState(WorkoutLength.MEDIUM);
  
  const [cardioDuration, setCardioDuration] = useState(10);
  const [cardioType, setCardioType] = useState("Run");
  const [cardioSession, setCardioSession] = useState<CardioSession | null>();

  const setAndCacheCompletedWorkoutSessions = (wr: GetCompletedWorkoutSessionsResponse) => {
    setCompletedWorkoutSessions(wr.completed_sessions);
    persistCompletedWorkoutSessions(wr);
  };
  const setAndCachePossibleWorkoutSessions = (w: Array<WorkoutSession>) => {
    setPossibleWorkoutSessions(w);
    persistPossibleWorkoutSessions(w);
  };
  const setAndCacheCurrentWorkoutSession = (ws: WorkoutSession) => {
    persistWorkoutSession(ws);
    setCurrentWorkoutSession(ws);
  };
  const [date, setDate] = useState(props.route.params?.date ? props.route.params.date : new Date());
  const getImageSource = (wt: WorkoutType) => {
    switch (wt) {
    case WorkoutType.CHEST:
      return require('app/assets/images/main/chest.png');
    case WorkoutType.BACK:
      return require('app/assets/images/main/back.png');
    case WorkoutType.LEGS:
      return require('app/assets/images/main/legs.png');
    case WorkoutType.SHOULDER:
      return require('app/assets/images/main/shoulders.png');
    case WorkoutType.ARMS:
      return require('app/assets/images/main/arms.png');
    case WorkoutType.PUSH:
      return require('app/assets/images/main/push.png');
    case WorkoutType.PULL:
      return require('app/assets/images/main/pull.png');
    case WorkoutType.UPPER:
      return require('app/assets/images/main/chest.png');
    case WorkoutType.LOWER:
      return require('app/assets/images/main/legs.png');
    case WorkoutType.SHOULDER_TRICEPS:
      return require('app/assets/images/main/shoulders.png');
    case WorkoutType.BACK_BICEPS:
      return require('app/assets/images/main/backBiceps.png');
    default:
      assertNever(wt);
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      const handleGetCompletedWorkoutSessions = (resp: GetCompletedWorkoutSessionsResponse) => {
        // If there is a completed session for the current date,
        // set it as the current workout.
        const sessions = resp.completed_sessions;
        setAndCacheCompletedWorkoutSessions(resp);
        if (sessions && sessions.length > 0) {
          const currentCompletedSession = sessions.find(s => s.is_completed && new Date(s.completed_at).toLocaleDateString() === date.toLocaleDateString());
          if (currentCompletedSession) {
            setCurrentWorkoutSession(currentCompletedSession);
            setIsLoading(false);
            return;
          }
        }
        // Check the cache for the current workout.
        getCachedWorkoutSessionKey().then(wr => {
          if (wr) {
            setCurrentWorkoutSession(wr);
            return setIsLoading(false);
          }
          // This is needed when abandoning a workout.
          setCurrentWorkoutSession(undefined);
          setIsLoading(true);
          // Make a request to get the day's workouts.
          makeRequest<GetWorkoutSessionV2Response>({
            method: 'GET',
            url: getWorkoutSessionV2Route,
          }).then((resp: GetWorkoutSessionV2Response) => {
            setAndCachePossibleWorkoutSessions(resp);
            return setIsLoading(false);
          }).catch(() => {
            // TODO(danielc): handle error
          });
        }).catch(() => {
          // TODO(danielc): handle error
        })
      }
      // Check cache for completed workout sessions
      getCachedCompletedWorkoutSessions().then(completedSessions => {
        if (completedSessions) {
          handleGetCompletedWorkoutSessions(completedSessions)
        } else {
          setIsLoading(true);
          // Fetch completed sessions.
          makeRequest<GetCompletedWorkoutSessionsResponse>({
            method: 'GET',
            url: getCompletedWorkoutSessionsRoute,
          }).then((resp: GetCompletedWorkoutSessionsResponse) => {
            handleGetCompletedWorkoutSessions(resp)
          });
        }
      }).catch((err: NetworkError) => {
        // TODO(danielc): handle error
      });
    }, [date])
  );
  useFocusEffect(
    React.useCallback(() => {
      if (cardioSession) {
        return;
      }
      getCachedActiveCardioSessionKey().then((cardioSession) => {
        setCardioSession(cardioSession);
      });
    }, [])
  );
  useEffect(() => {
    if (!completedWorkoutSessions) {
      return;
    }
    // If it's the current date, set the workout to the cached value.
    if (getUTCDate(date) === getUTCDate((new Date()))) {
      getCachedWorkoutSessionKey().then(wr => {
        if (wr) {
          return setCurrentWorkoutSession(wr);
        }
        // Get the completed workout for the date, and set it as the workout.
      const currentCompletedSession = completedWorkoutSessions?.find(s => s.is_completed && new Date(s.completed_at).toLocaleDateString() === date.toLocaleDateString());
      if (!currentCompletedSession) {
        // This is needed when switching between dates if the user hasn't started a workout.
        return setCurrentWorkoutSession(undefined);
      }
      setCurrentWorkoutSession(currentCompletedSession);
      });
    }
    // Get the completed workout for the date, and set it as the workout.
    const currentCompletedSession = completedWorkoutSessions?.find(s => s.is_completed && new Date(s.completed_at).toLocaleDateString() === date.toLocaleDateString());
    if (!currentCompletedSession) {
      return;
    }
    setCurrentWorkoutSession(currentCompletedSession);
  }, [date]);
  useEffect(() => {
    if (currentWorkoutSession) {
      setWorkoutLength(currentWorkoutSession.workout_routine.workout_length);
      setWorkoutLocation(currentWorkoutSession.workout_routine.workout_location);
    }
  }, [currentWorkoutSession]);
  let content;
  if (isLoading) {
    content = (
      <View style={styles.loadingContainer}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      </View>
    );  
  } else {
    let status = StartWorkoutCardStatus.NotStarted;
    if (currentWorkoutSession) {
      if (currentWorkoutSession.is_completed) {
        status = StartWorkoutCardStatus.Complete;
      } else {
        status = StartWorkoutCardStatus.InProgress;
      }
    }
    let workoutCardContent;
    if (currentWorkoutSession) {
      const onPress = () => {
        props.navigation.navigate('Workout', {
          date: date,
          completedWorkoutSession: currentWorkoutSession.is_completed ? currentWorkoutSession : undefined,
          fromScreen: WorkoutScreenFromScreen.Main,
        });
      }
      workoutCardContent = (
        <View style={styles.paddedContent}>
          <StartWorkoutCard
            status={status}
            workoutType={currentWorkoutSession.workout_routine.target_muscle_group}
            workoutLength={currentWorkoutSession.workout_routine.workout_length}
            estimatedCalories={currentWorkoutSession.estimated_calories_burned}
            onChangeWorkoutLength={(wl: WorkoutLength) => setWorkoutLength(wl)}
            imageSrc={getImageSource(currentWorkoutSession.workout_routine.target_muscle_group)}
            onPress={onPress}
          />
        </View>
      );
    } else if (possibleWorkoutSessions) {
      const filteredWorkoutSessions = possibleWorkoutSessions.filter(ws => {
        return ws.workout_routine.workout_length === workoutLength &&
          ws.workout_routine.workout_location === workoutLocation;
      });
      type WorkoutCardInfo = {item: WorkoutSession, index: number};
      const renderWorkoutCard = (info: WorkoutCardInfo) => {
        return (
          <View style={[
            styles.workoutCardContainer,
          ]}>
            <StartWorkoutCard
              key={info.item.workout_session_id + '-' + info.index}
              status={status}
              workoutType={info.item.workout_routine.target_muscle_group}
              workoutLength={info.item.workout_routine.workout_length}
              estimatedCalories={info.item.estimated_calories_burned}
              onChangeWorkoutLength={(wl: WorkoutLength) => setWorkoutLength(wl)}
              imageSrc={getImageSource(info.item.workout_routine.target_muscle_group)}
              onPress={() => {
                setAndCacheCurrentWorkoutSession(info.item);
                props.navigation.navigate('Workout', {
                  date: date,
                  fromScreen: WorkoutScreenFromScreen.Main,
                });
              }}
              useXSmallButton
            />
          </View>
        )
      };
      workoutCardContent = (
        <View style={styles.swiperContainer}>
          <Carousel
            style={styles.swiper}
            data={filteredWorkoutSessions}
            loop={false}
            renderItem={renderWorkoutCard}
            onSnapToItem={(index: number) => {}}
            sliderWidth={width}
            itemWidth={width * .82}
          />
        </View>
      );
    }
    const header = new Date().toLocaleDateString() === date.toLocaleDateString()
      ? 'Today’s Workouts'
      : prettyDateSlashes(date) + ' Workout';
    content = (
      <View style={styles.cardContainer}>
        <View style={styles.workoutHeader}>
          <View style={styles.workoutHeading}>
              <Heading4 color={HeadingColor.Gray}>{header}</Heading4>
          </View>
          {status === StartWorkoutCardStatus.NotStarted &&
            <View style={styles.workoutSelector}>
              <View style={styles.workoutLocationContainer}>
                <View style={styles.toggleContainer}>
                  <TouchableWithoutFeedback
                    onPress={() => setWorkoutLocation(WorkoutLocation.GYM)}
                    disabled={status !== StartWorkoutCardStatus.NotStarted}
                  >
                    <View style={[
                      styles.leftToggle,
                      workoutLocation === WorkoutLocation.GYM ? styles.activeToggle : styles.inactiveLeftToggle,
                    ]}>
                      <Text color={workoutLocation === WorkoutLocation.GYM ? TextColor.Orange : TextColor.LightGray}>
                        {displayNameForWorkoutLocation(WorkoutLocation.GYM)}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                  <TouchableWithoutFeedback
                    onPress={() => setWorkoutLocation(WorkoutLocation.HOME)}
                    disabled={status !== StartWorkoutCardStatus.NotStarted}
                  >
                    <View style={[
                      styles.rightToggle,
                      workoutLocation === WorkoutLocation.HOME ? styles.activeToggle : styles.inactiveRightToggle,
                    ]}>
                      <Text color={workoutLocation === WorkoutLocation.HOME ? TextColor.Orange : TextColor.LightGray}>
                        {displayNameForWorkoutLocation(WorkoutLocation.HOME)}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              </View>
            </View>
          }
        </View>
        {workoutCardContent}
        <View style={styles.paddedContent}>
          {completedWorkoutSessions && completedWorkoutSessions.length < 8 &&
            <AssesmentCard completedAssesments={completedWorkoutSessions.length}/>
          }
          <CardioCard
            isActiveSession={ cardioSession != null }
            durationMinutes={ cardioSession != null ? cardioSession.durationMinutes : cardioDuration }
            activeSessionType={ cardioSession != null ? cardioSession.type : "" }
            onPressStart={ () => {
              let duration = {seconds: 0, minutes: cardioDuration, totalSessionDurationMinutes: cardioDuration};
              if (cardioSession) {
                duration.minutes = cardioSession.durationMinutes;
                duration.seconds = cardioSession.durationSeconds;
                duration.totalSessionDurationMinutes = cardioSession.totalSessionDurationMinutes;
              }
              props.navigation.navigate('Cardio', {
                minutes: duration.minutes,
                seconds: duration.seconds,
                type: cardioType,
                totalSessionDurationMinutes: duration.totalSessionDurationMinutes
              });
            }}
            handleDurationChange={ (duration) => {
              setCardioDuration(duration);
            }}
            handleCardioTypeChange={ (type) => {
              setCardioType(type);
            }}
          />
        </View>
      </View>
    );
  }
  const getOnPressDateHandler = (date: Date) => {
    return () => setDate(date);
  }
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      bounces={false}
      contentContainerStyle={{flexGrow: 1}}
    >
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.orange, '#ff8474']}
        style={styles.headerContainer}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require('app/assets/images/main/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.calendarContainer}>
          <WeekCalendar
            date={date}
            completedWorkouts={completedWorkoutSessions}
            getOnPressDateHandler={getOnPressDateHandler}
          />
        </View>
      </LinearGradient>
      {content}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 20,
  },
  logoContainer: {
    height: 64,
    width: 198,
    marginBottom: 24,
  },
  logo: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  calendarContainer: {
    alignSelf: 'stretch',
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 6,
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    marginTop: -20,
  },
  cardContainer: {
    flex: 1,
    backgroundColor: colors.white,
    // paddingLeft: 20,
    // paddingRight: 20,
    paddingBottom: 30,
    borderRadius: 20,
    marginTop: -20,
    paddingTop: 8,
  },
  workoutHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    marginLeft: isSmallWidth ? 8 : 12,
    marginBottom: 8,
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
  },
  workoutHeading: {
    alignSelf: 'flex-end',
  },
  workoutLocationContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 6,
  },
  leftToggle: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
  },
  rightToggle: {
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 10,
    paddingLeft: 10,
    borderWidth: 1,
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
  activeToggle: {
    borderColor: colors.orange,
    backgroundColor: colors.backgroundOrange,
  },
  inactiveLeftToggle: {
    borderColor: colors.lightGray,
    borderRightWidth: 0,
  },
  inactiveRightToggle: {
    borderColor: colors.lightGray,
    borderLeftWidth: 0,
  },
  verticalDivider: {
    borderRightWidth: 2,
    borderRightColor: colors.borderGray,
    height: 50,
    marginLeft: isSmallWidth ? 24 : 36,
    marginRight: 6,
  },
  workoutSelector: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: isSmallWidth ? 8 : 12,
  },
  smallText: {
    fontSize: 14,
  },
  swiperContainer: {
    display: 'flex',
    flexDirection: 'row',
    // justifyContent: 'center',
    backgroundColor: colors.white,
  },
  swiper: {
  },
  workoutCardContainer: {
    // marginLeft: 6,
    // marginRight: 6,
    paddingTop: 18,
    paddingBottom: 12,
  },
  paddedContent: {
    paddingLeft: horizontalPadding,
    paddingRight: horizontalPadding,
  }
});

export default MainScreen;