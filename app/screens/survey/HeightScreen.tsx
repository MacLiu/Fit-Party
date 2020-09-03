import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Heading2, Heading3, HeadingColor } from 'app/components/Headings';
import { RootStackParamList } from 'app/utils/routes';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import Text from 'app/components/Text';
import TextInput, { TextInputType, TextInputSize } from 'app/components/form/TextInput';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import NumberInput, { NumberInputColor } from 'app/components/form/NumberInput';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type HeightScreenNavigationProp = StackNavigationProp<RootStackParamList, 'HeightSurvey'>;
type HeightScreenRouteProp = RouteProp<RootStackParamList, 'HeightSurvey'>;

type HeightScreenProps = {
  navigation: HeightScreenNavigationProp;
  route: HeightScreenRouteProp;
};

const HeightScreen = (props: HeightScreenProps) => {
  const [feet, setFeet] = useState('');
  const onChangeFeet = (f: string) => {
    return setFeet(f);
  };
  const [inches, setInches] = useState('');
  const onChangeInches = (i: string) => {
    return setInches(i);
  };
  const disabled = !(feet && inches);
  return (
    <View style={styles.container}>
    <View style={styles.progress}>
      <ProgressBar section={ProgressBarSection.Height} />
    </View>
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.headingContainer}>
        {isSmallWidth
          ? <Heading3 center color={HeadingColor.Black}>What’s your height?</Heading3>
          : <Heading2 center color={HeadingColor.Black}>What’s your height?</Heading2>
        }
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.textInputContainer}>
          <NumberInput
            color={NumberInputColor.Orange}
            onChange={onChangeFeet}
            value={feet}
            size={isSmallWidth ? TextInputSize.Medium : TextInputSize.Large}
            centered
            maxDigits={1}
            upperBound={8}
          />
        </View>
        <View style={styles.textContainer}>
          <Text bold style={styles.largeText}>ft</Text>
        </View>
        <View style={styles.textInputContainer}>
          <NumberInput
            color={NumberInputColor.Orange}
            onChange={onChangeInches}
            value={inches}
            size={isSmallWidth ? TextInputSize.Medium : TextInputSize.Large}
            centered
            maxDigits={2}
            upperBound={11}
          />
        </View>
        <Text bold style={styles.largeText}>in</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={disabled}
          color={ButtonColor.Orange}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            props.navigation.navigate('ExperienceSurvey', {
              surveyResponses: {
                ...props.route.params.surveyResponses,
                heightInches: parseInt(feet) * 12 + parseInt(inches),
              },
            });
          }}
          text={'Next'}
          textBold
        />
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingTop: 60,
  },
  progress: {
    paddingLeft: isSmallWidth ? 30 : 40,
    paddingRight: isSmallWidth ? 30 : 40,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  headingContainer: {
    marginBottom: 20,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  scrollContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: "space-around",
  },
  inputContainer: {
    alignItems: 'flex-end',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  textInputContainer: {
    marginRight: 10,
    width: isSmallWidth ? 75 : 100,
  },
  textContainer: {
    marginRight: 10,
  },
  buttonContainer: {
    width: width * .85,
  },
  largeText: {
    fontSize: isSmallWidth ? 36 : 50,
    paddingBottom: 6,
  },
});

export default HeightScreen;
