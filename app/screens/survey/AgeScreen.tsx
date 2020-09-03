import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import { RootStackParamList } from 'app/utils/routes';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import { breakpoint375 } from 'app/utils/screenSize';
import colors from 'app/assets/colors';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type AgeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AgeSurvey'>;
type AgeScreenRouteProp = RouteProp<RootStackParamList, 'AgeSurvey'>;

type AgeScreenProps = {
  navigation: AgeScreenNavigationProp;
  route: AgeScreenRouteProp;
};

const AgeScreen = (props: AgeScreenProps) => {
  const [date, setDate] = useState(new Date());
  const onChange = (event: Event, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  }
  return (
    <View style={styles.container}>
      <ProgressBar section={ProgressBarSection.Age} />
      <View style={styles.headingContainer}>
        {isSmallWidth
          ? <Heading3 center color={HeadingColor.Black}>What’s your birthday?</Heading3>
          : <Heading2 center color={HeadingColor.Black}>What’s your birthday?</Heading2>
        }
      </View>
      <DateTimePicker
        value={date}
        mode={'date'}
        onChange={onChange}
        style={styles.datePicker}
        textColor={colors.black}
      />
      <View style={styles.buttonContainer}>
        <Button
          color={ButtonColor.Orange}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            props.navigation.navigate('WeightSurvey', {
              surveyResponses: {
                ...props.route.params.surveyResponses,
                birthday: date,
              },
            });
          }}
          text={'Next'}
          textBold
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: isSmallWidth ? 30 : 40,
    paddingRight: isSmallWidth ? 30 : 40,
    paddingTop: 60,
  },
  headingContainer: {
    marginTop: height * .1,
    marginBottom: height * .05,
  },
  datePicker: {
    height: height * .4,
    fontSize: 16,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 44,
  },
});

export default AgeScreen;
