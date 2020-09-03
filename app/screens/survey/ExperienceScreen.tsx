import React, { useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import { RootStackParamList, Experience } from 'app/utils/routes';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import { breakpoint375 } from 'app/utils/screenSize';
import { getDisplayNameForTrainingExperience } from 'app/endpoints/user/user';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type ExperienceScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ExperienceSurvey'>;
type ExperienceScreenRouteProp = RouteProp<RootStackParamList, 'ExperienceSurvey'>;

type ExperienceScreenProps = {
  navigation: ExperienceScreenNavigationProp;
  route: ExperienceScreenRouteProp;
};

const ExperienceScreen = (props: ExperienceScreenProps) => {
  const [inverted, setInverted] = useState<Experience | null>(null);
  const disabled = !inverted;
  const buttonTextSize = isSmallWidth ? 18 : 24;
  return (
    <View style={styles.container}>
      <ProgressBar section={ProgressBarSection.Experience} />
      <View style={styles.headingContainer}>
        {isSmallWidth
          ? <Heading3 center color={HeadingColor.Black}>What is your weight training experience?</Heading3>
          : <Heading2 center color={HeadingColor.Black}>What is your weight training experience?</Heading2>
        }
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === Experience.NoExperience ? ButtonColor.Orange : ButtonColor.White}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => setInverted(Experience.NoExperience)}
          text={getDisplayNameForTrainingExperience(Experience.NoExperience)}
          textBold
          textSize={buttonTextSize}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === Experience.Beginner ? ButtonColor.Orange : ButtonColor.White}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => setInverted(Experience.Beginner)}
          text={getDisplayNameForTrainingExperience(Experience.Beginner)}
          textBold
          textSize={buttonTextSize}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === Experience.Experienced ? ButtonColor.Orange : ButtonColor.White}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => setInverted(Experience.Experienced)}
          text={getDisplayNameForTrainingExperience(Experience.Experienced)}
          textBold
          textSize={buttonTextSize}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          color={inverted === Experience.Pro ? ButtonColor.Orange : ButtonColor.White}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => setInverted(Experience.Pro)}
          text={getDisplayNameForTrainingExperience(Experience.Pro)}
          textBold
          textSize={buttonTextSize}
        />
      </View>
      <View style={styles.bottom}>
        <Button
          disabled={disabled}
          color={ButtonColor.Orange}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            props.navigation.navigate('FocusSurvey', {
              surveyResponses: {
                ...props.route.params.surveyResponses,
                experience: inverted,
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
  buttonContainer: {
    marginBottom: height * .025,
  },
  bottom: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 44,
  },
});

export default ExperienceScreen;
