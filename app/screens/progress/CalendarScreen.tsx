import React, { useState, useCallback, useMemo } from 'react';
import { ScrollView } from "react-native-gesture-handler"
import LinearGradient from 'react-native-linear-gradient';
import colors from 'app/assets/colors';
import { View, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Heading2, HeadingColor, Heading35 } from 'app/components/Headings';
import { Calendar, DateObject, CustomMarking, DotMarking } from 'react-native-calendars';
import Card from 'app/components/Card';
import fonts from 'app/assets/fonts';
import { WorkoutSession, getCachedCompletedWorkoutSessions, GetCompletedWorkoutSessionsResponse, getCompletedWorkoutSessionsRoute, persistCompletedWorkoutSessions } from 'app/endpoints/workout/workout';
import { makeRequest, NetworkError } from 'app/utils/network';
import { stringToFormattedDate, getCurrentFormattedDate, dateToFormattedString, prettyCalendarMonth } from 'app/utils/datetime';
import { useFocusEffect } from '@react-navigation/native';
import WorkoutDetailsCard from 'app/screens/progress/WorkoutDetailsCard';
import { GetCalorieLogsResponse, getCachedCalorieLogs, getCalorieLogsRoute, persistCalorieLogs } from 'app/endpoints/progress/calories';
import Text, { TextColor } from 'app/components/Text';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, WorkoutScreenFromScreen } from 'app/utils/routes';

const { height } = Dimensions.get('window');

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Calendar'>;

type CalendarScreenProps = {
  navigation: CalendarScreenNavigationProp;
};

const CalendarScreen = (props: CalendarScreenProps) => {
  const [completedWorkoutSessions, setCompletedWorkoutSessions] = useState<Array<WorkoutSession> | undefined>(undefined);
  const [calorieLogs, setCalorieLogs] = useState<GetCalorieLogsResponse | undefined>(undefined);
  const [currentDate, setCurrentDate] = useState(getCurrentFormattedDate());
  const setAndCacheCompletedWorkoutSessions = (wr: GetCompletedWorkoutSessionsResponse) => {
    setCompletedWorkoutSessions(wr.completed_sessions);
    persistCompletedWorkoutSessions(wr);
  };
  useFocusEffect(
    React.useCallback(() => {
      getCachedCompletedWorkoutSessions().then(completedSessions => {
        if (completedSessions) {
          return setCompletedWorkoutSessions(completedSessions.completed_sessions);
        }
        // Fetch completed sessions.
        makeRequest<GetCompletedWorkoutSessionsResponse>({
          method: 'GET',
          url: getCompletedWorkoutSessionsRoute,
        }).then((resp: GetCompletedWorkoutSessionsResponse) => {
          setAndCacheCompletedWorkoutSessions(resp);

        });
      });
    }, [])
  );
  useFocusEffect(
    React.useCallback(() => {
      getCachedCalorieLogs().then((logs) => {
        if (logs) {
          setCalorieLogs(logs);
          return;
        }
        makeRequest<GetCalorieLogsResponse>({
          method: 'GET',
          url: getCalorieLogsRoute,
        }).then((resp: GetCalorieLogsResponse) => {
          setCalorieLogs(resp);
          persistCalorieLogs(resp);
        }).catch((err: NetworkError) => {
          // TODO: handle error
        });
      })
    }, [])
  );
  const onDateChange = useCallback((date: DateObject) => {
    setCurrentDate(date.dateString);
  }, []);
  // Build map from date to workout session.
  const dateToWorkoutSession = useMemo(() => {
    if (!completedWorkoutSessions) {
      return new Map<string, WorkoutSession>();
    }
    const out: Map<string, WorkoutSession> = new Map<string, WorkoutSession>();
    completedWorkoutSessions.forEach(ws => {
      out.set(stringToFormattedDate(ws.completed_at), ws);
    });
    return out;
  }, completedWorkoutSessions);
  // Get number of days in a row of completed workouts.
  const workoutStreak = useMemo(() => {
    if (!completedWorkoutSessions) {
      return 0;
    }
    let today = getCurrentFormattedDate();
    let streak = dateToWorkoutSession.has(today) ? 1 : 0;
    const current = new Date();
    while(true) {
      current.setDate(current.getDate() - 1);
      const key = dateToFormattedString(current);
      if (!dateToWorkoutSession.has(key)) {
        break;
      }
      streak++;
    }
    return streak;
  }, [completedWorkoutSessions, dateToWorkoutSession])
  // Build marked dates for calendar.
  const markedDates: {[date: string]: DotMarking} = {};
  if (completedWorkoutSessions) {
    completedWorkoutSessions.forEach(ws => {
      const date = stringToFormattedDate(ws.completed_at);
      markedDates[date] = {
        marked: true,
      };
    });
  }
  markedDates[currentDate] = {
    ...markedDates[currentDate],
    selected: true,
    selectedColor: colors.orange,
  };
  // Get the current date's workout session
  const currentWorkoutSession = dateToWorkoutSession.get(currentDate);
  // Build map from date to calories burned.
  const caloriesByDate = useMemo(() => {
    if (!calorieLogs) {
      return new Map<string, number>();
    }
    return calorieLogs
      .reduce<Map<string, number>>((accu: Map<string, number>, cl) => {
        const localDate = stringToFormattedDate(cl.logged_at);
        accu.set(localDate, (accu.get(localDate) || 0) + parseInt(cl.calories));
        return accu;
      }, new Map<string, number>());
  }, [calorieLogs]);
  const onPressViewWorkout = () => {
    props.navigation.navigate('Workout', {
      date: new Date(currentDate),
      completedWorkoutSession: currentWorkoutSession,
      fromScreen: WorkoutScreenFromScreen.Calendar,
    });
  }
  let content;
  if (!calorieLogs || !completedWorkoutSessions) {
    content = (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  } else {
    content = (
      <View style={styles.content}>
        <View style={styles.calendarCardContainer}>
          <Card>
            <Calendar
              style={styles.calendar}
              current={currentDate}
              onDayPress={onDateChange}
              theme={{
                arrowColor: colors.orange,
                todayTextColor: colors.orange,
                dotColor: colors.orange,
                selectedDayBackgroundColor: colors.orange,
                selectedDayTextColor: colors.white,
                textDayFontFamily: fonts.default,
                textMonthFontFamily: fonts.default,
                textDayHeaderFontFamily: fonts.default,
                textMonthFontWeight: 'bold',
                textDayFontSize: 14,
                textMonthFontSize: 14,
                textDayHeaderFontSize: 14,
              }}
              markedDates={markedDates}
              renderHeader={(date: string) => { return <Heading35>{prettyCalendarMonth(date)}</Heading35>}}
            />
          </Card>
        </View>
        {currentWorkoutSession && (
          <View style={styles.cardContainer}>
            <WorkoutDetailsCard
              workoutSession={currentWorkoutSession}
              caloriesBurned={caloriesByDate.get(currentDate)!}
              onPress={onPressViewWorkout}
            />
          </View>
        )}
        <View style={styles.cardContainer}>
          <Card noPadding>
            <View style={styles.gradientContainer}>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={[colors.orange, '#ff8474']}
              >
                <View style={styles.streakContent}>
                  <View style={styles.row}>
                    <Text style={styles.streakText} color={TextColor.White} bold>{workoutStreak}</Text>
                    <Text color={TextColor.White} style={styles.daysText}> days</Text>
                  </View>
                  <Text color={TextColor.White} style={styles.currentStreakText}>Your current streak</Text>
                </View>
              </LinearGradient>
            </View>
          </Card>
        </View>
      </View>
    );
  }
  // Build map from date to total calories logged on that date.
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
        <Heading2 color={HeadingColor.White}>Workout History</Heading2>
      </LinearGradient>
      {content}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: height * .08,
    paddingBottom: height * .06,
  },
  content: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    marginTop: -20,
    paddingBottom: 42,
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarCardContainer: {
    marginTop: height * .05,
  },
  calendar: {
    // height: 200,
    // width: width * .8,
  },
  calendarMonth: {
    fontSize: 22,
  },
  cardContainer: {
    marginTop: height * .025,
  },
  gradientContainer: {
    overflow: 'hidden',
    borderRadius: 16,
  },
  streakContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 14,
    paddingBottom: 14,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  streakText: {
    fontSize: 36,
  },
  daysText: {
    fontSize: 18,
  },
  currentStreakText: {
    fontSize: 16
  },
});

export default CalendarScreen;
