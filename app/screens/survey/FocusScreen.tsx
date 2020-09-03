import React, { useState } from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import { RootStackParamList, TrainingGoal } from 'app/utils/routes';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import Text, { TextColor } from 'app/components/Text';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import { RouteProp } from '@react-navigation/native';
import { makeRequest } from 'app/utils/network';
import { userInfoRoute, UpdateUserInfoResponse, persistUserInfo, getDisplayNameForTrainingGoal } from 'app/endpoints/user/user';
import moment from 'moment';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type FocusScreenNavigationProp = StackNavigationProp<RootStackParamList, 'FocusSurvey'>;
type FocusScreenRouteProp = RouteProp<RootStackParamList, 'FocusSurvey'>;

type FocusScreenProps = {
  navigation: FocusScreenNavigationProp;
  route: FocusScreenRouteProp;
};

const FocusScreen = (props: FocusScreenProps) => {
  const [inverted, setInverted] = useState<TrainingGoal | null>(null);
  const disabled = !inverted;
  const onPress = () => {
    const surveyResponses = props.route.params.surveyResponses;
    makeRequest<UpdateUserInfoResponse>({
      method: 'PUT',
      url: userInfoRoute,
      body: {
        name: surveyResponses.name,
        height_in_inches: surveyResponses.heightInches,
        gender: surveyResponses.gender,
        training_experience: surveyResponses.experience,
        training_goal: inverted,
        birth_date: moment(surveyResponses.birthday).format('YYYY-MM-DD'),
      },
    }).then(() => {
      persistUserInfo(surveyResponses)
      props.navigation.navigate('Home');
    }).catch(() => {
      // TODO(danielc): handle error
    });
  }
  return (
    <View style={styles.container}>
      <ProgressBar section={ProgressBarSection.Focus} />
      <View style={styles.headingContainer}>
        {isSmallWidth
          ? <Heading3 center color={HeadingColor.Black}>What is your goal?</Heading3>
          : <Heading2 center color={HeadingColor.Black}>What is your goal?</Heading2>
        }
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === TrainingGoal.MuscleGain ? ButtonColor.Orange : ButtonColor.White}
          size={ButtonSize.Medium}
          onPress={() => setInverted(TrainingGoal.MuscleGain)}
          text={getDisplayNameForTrainingGoal(TrainingGoal.MuscleGain)}
          textBold
          textSize={24}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === TrainingGoal.WeightLoss ? ButtonColor.Orange : ButtonColor.White}
          size={ButtonSize.Medium}
          onPress={() => setInverted(TrainingGoal.WeightLoss)}
          text={getDisplayNameForTrainingGoal(TrainingGoal.WeightLoss)}
          textBold
          textSize={24}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === TrainingGoal.Recompisition ? ButtonColor.Orange : ButtonColor.White}
          size={ButtonSize.Medium}
          onPress={() => setInverted(TrainingGoal.Recompisition)}
          text={getDisplayNameForTrainingGoal(TrainingGoal.Recompisition)}
          textBold
          textSize={24}
        />
      </View>
      <View style={styles.bottom}>
        <Button
          disabled={disabled}
          color={ButtonColor.Orange}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={onPress}
          text={'Get Started'}
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
  buttonContainer: {
    marginBottom: height * .025,
  },
  buttonContent: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  imageContainer: {
    // height: height * .1,
    // width: width * .15,
  },
  image: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  muscleImageContainer: {
    marginRight: 6,
    height: height * .1,
    width: width * .2,
  },
  waistImageContainer: {
    marginLeft: 6,
    height: height * .1,
    width: width * .2,
  },
  waistImage: {
    transform: [{ scale: .8 }],
  },
  bothWaistContainer: {
    marginRight: 6,
  },
  bothMuscleContainer: {
    marginLeft: 6,
  },
  buttonText: {
    fontSize: isSmallWidth ? 18 : 24,
    // paddingTop: 10,
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 44,
  },
});

export default FocusScreen;
