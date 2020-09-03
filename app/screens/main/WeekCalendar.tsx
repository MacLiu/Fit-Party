import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';

import Text, { TextColor } from 'app/components/Text';
import colors from 'app/assets/colors';
import { WorkoutSession } from 'app/endpoints/workout/workout';
import { getUTCDate, stringToLocalDate, getDayAbbreviation } from 'app/utils/datetime';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type WeekCalendarProps = {
  date: Date;
  completedWorkouts: Array<WorkoutSession> | undefined;
  getOnPressDateHandler: (date: Date) => () => void;
};

const { width, height } = Dimensions.get('window');

const WeekCalendar = (props: WeekCalendarProps) => {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  let calendarDays = [];
  for (let i = -3; i < 4; i++) {
    const tmpDay = new Date(today);
    tmpDay.setDate(tmpDay.getDate() + i);
    const completed = props.completedWorkouts?.some(
      w => stringToLocalDate(w.completed_at) === tmpDay.toLocaleDateString()
    );
    calendarDays.push(
      <View key={i} style={styles.dayContainer}>
        <Text
          color={TextColor.White}
          bold
          style={[
            styles.calendarDay,
            {opacity: 1 - (Math.abs(i) * .25)},
          ]}
        >
          {getDayAbbreviation(tmpDay)}
        </Text>
        <View
          style={[styles.dateContainer]}
        >
          <TouchableWithoutFeedback
            onPress={(completed || i === 0) ? props.getOnPressDateHandler(tmpDay) : undefined}
            style={[
              styles.touchable,
              (completed || i === 0) && styles.completedTouchable,
            ]}
          >
            <View style={styles.touchableContent}>
              {completed ?
                <Image
                  source={require('app/assets/images/main/check.png')}
                /> :
                <Text
                  color={TextColor.White}
                  style={[
                    styles.calendarDayNumber,
                    {opacity: 1 - (Math.abs(i) * .25)},
                  ]}
                >
                  {tmpDay.getDate()}
                </Text>
              } 
            </View>
          </TouchableWithoutFeedback>
          <View style={getUTCDate(tmpDay) === getUTCDate(props.date) ? styles.underline : styles.hidden} />
        </View>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Text bold color={TextColor.White} style={styles.month}>{month}</Text>
      <View style={styles.calendar}>
        {calendarDays}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  month: {
    textAlign: 'center',
    fontSize: 14,
  },
  calendar: {
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingBottom: 6,
  },
  dayContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  dateContainer: {
    // marginTop: ,
  },
  touchable: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    // paddingLeft: 9,
    // paddingRight: 9,
    // paddingTop: 6,
    height: 30,
    width: 30,
  },
  completedTouchable: {
    // borderColor: colors.white,
    // borderWidth: 2,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 204, 204, 0.3)',
    // backgroundColor: 'rgba(233,83,63, .2)',
  },
  touchableContent: {
    // padding: 6
  },
  calendarDay: {
    fontSize: 16,
    marginBottom: 3,
  },
  calendarDayNumber: {
    fontSize: 14,
  },
  underline: {
    borderBottomColor: colors.white,
    borderBottomWidth: 2,
    marginTop: 4,
    // paddingLeft: 4,
    // paddingRight: 4,
  },
  hidden: {
    marginTop: 6,
    paddingLeft: 6,
    paddingRight: 6,
  }
});

export default WeekCalendar;
