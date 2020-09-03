import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { Heading2, HeadingColor, Heading3 } from 'app/components/Headings';
import TextInput, { TextInputSize } from 'app/components/form/TextInput';
import GenderInput from 'app/screens/survey/GenderInput';
import ProgressBar, { ProgressBarSection } from 'app/screens/survey/ProgressBar';
import { RootStackParamList, Gender } from 'app/utils/routes';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type NameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'NameSurvey'>;
type NameScreenRouteProp = RouteProp<RootStackParamList, 'NameSurvey'>;

type NameScreenProps = {
  navigation: NameScreenNavigationProp;
  route: NameScreenRouteProp;
};

const NameScreen = (props: NameScreenProps) => { 
  const [name, setName] = useState('');
  const onChangeName = (name: string) => {
    return setName(name);
  };
  const [gender, setGender] = useState<Gender | null>(null)
  const onPressMan = () => {
    setGender(Gender.Male);
  };
  const onPressWoman = () => {
    setGender(Gender.Female);
  };
  const disabled = !(name && gender);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <ProgressBar section={ProgressBarSection.Gender} />
      <View style={styles.nameInputContainer}>
        <View style={styles.headingContainer}>
          {isSmallWidth
            ? <Heading3 center color={HeadingColor.Black}>What’s your name?</Heading3>
            : <Heading2 center color={HeadingColor.Black}>What’s your name?</Heading2>
          }
        </View>
        <View>
          <TextInput
            onChangeText={onChangeName}
            placeholder={'Enter your first name.'}
            value={name}
            size={isSmallWidth ? TextInputSize.Small : TextInputSize.Medium}
            centered
          />
        </View>
      </View>
      <View>
        <GenderInput
          onPressMan={onPressMan}
          onPressWoman={onPressWoman}
          gender={gender}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          disabled={disabled}
          color={ButtonColor.Orange}
          size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
          onPress={() => {
            props.navigation.navigate('AgeSurvey', {
              surveyResponses: {
                name: name,
                gender: gender,
                age: null,
                heightInches: null,
                experience: null,
                birthday: null,
                trainingGoal: null,
                weightPounds: null,
              },
            });
          }}
          text={'Next'}
          textBold
        />
      </View>
    </ScrollView>
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
  nameInputContainer: {
    marginTop: height * .1,
    marginBottom: height * .03,
  },
  headingContainer: {
    marginBottom: height * .03,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 44,
  },
});

export default NameScreen;
