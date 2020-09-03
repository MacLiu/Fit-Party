import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import { RootStackParamList } from 'app/utils/routes';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { TextInputSize } from 'app/components/form/TextInput';
import Text from 'app/components/Text';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import NumberInput, { NumberInputColor } from 'app/components/form/NumberInput';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type WeightScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WeightSurvey'>;
type WeightScreenRouteProp = RouteProp<RootStackParamList, 'WeightSurvey'>;

type WeightScreenProps = {
  navigation: WeightScreenNavigationProp;
  route: WeightScreenRouteProp;
};

const WeightScreen = (props: WeightScreenProps) => {
  const [weight, setWeight] = useState('');
  const onChangeWeight = (w: string) => {
    return setWeight(w);
  };
  const disabled = !weight;
  return (
    <View style={styles.container}>
    <View style={styles.progress}>
      <ProgressBar section={ProgressBarSection.Weight} />
    </View>
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.keyboardAvoidingContainer}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headingContainer}>
          {isSmallWidth
            ? <Heading3 center color={HeadingColor.Black}>What’s your weight?</Heading3>
            : <Heading2 center color={HeadingColor.Black}>What’s your weight?</Heading2>
          }
        </View>
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <NumberInput
              color={NumberInputColor.Orange}
              onChange={onChangeWeight}
              value={weight}
              size={isSmallWidth ? TextInputSize.Medium : TextInputSize.Large}
              centered
              maxDigits={3}
            />
          </View>
          <Text bold style={styles.largeText}>lbs</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            disabled={disabled}
            color={ButtonColor.Orange}
            size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
            onPress={() => {
              props.navigation.navigate('HeightSurvey', {
                surveyResponses: {
                  ...props.route.params.surveyResponses,
                  weightPounds: parseInt(weight),
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
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  textInputContainer: {
    marginRight: 10,
    width: isSmallWidth ? 75 : 100,
  },
  buttonContainer: {
    width: width * .85,
  },
  largeText: {
    fontSize: isSmallWidth ? 36 : 50,
    paddingBottom: 6,
  },
});

export default WeightScreen;
