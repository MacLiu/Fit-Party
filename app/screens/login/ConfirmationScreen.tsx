import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Text, { TextColor } from 'app/components/Text';
import { TextInputSize } from 'app/components/form/TextInput';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { RootStackParamList } from 'app/utils/routes';
import { Heading1 } from 'app/components/Headings';
import { makeRequest } from 'app/utils/network';
import CloseButton, { CloseButtonColor } from 'app/components/CloseButton';
import NumberInput, { NumberInputColor } from 'app/components/form/NumberInput';
import { breakpoint375 } from 'app/utils/screenSize';
import { verifySMSRoute } from 'app/endpoints/auth/auth';

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type ConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Confirmation'>;
type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'Confirmation'>;

type ConfirmationScreenProps = {
  navigation: ConfirmationScreenNavigationProp;
  route: ConfirmationScreenRouteProp;
};

const ConfirmationScreen = (props: ConfirmationScreenProps) => {
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onPressSignUp = () => {
    setIsLoading(true);
    setErrorMessage('');
    const { authyID } = props.route.params;
    makeRequest({
      url: verifySMSRoute,
      body: {
        authy_id: authyID,
        sms_code: confirmationNumber,
      },
    }).then(() => {
      setIsLoading(false);
      props.navigation.navigate('Onboarding');
    }).catch(() => {
      setIsLoading(false);
      setErrorMessage('There was an error validating your account, please try again.');
    });
  }
  // TODO(danielc): Add haptic feedback
  return (
    <View style={styles.rootContainer}>
    <KeyboardAvoidingView
      behavior={'padding'}
      style={styles.keyboardViewContainer}
    >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    <ScrollView contentContainerStyle={styles.inner}>
      <View style={styles.headerContainer}>
        <Heading1 bold={false} center>Enter confirmation code</Heading1>
      </View>
      <View style={styles.question}>
        <Text style={styles.label}>
          Please enter the verification code that was sent to your mobile number
        </Text>
        <View style={styles.inputContainer}>
          <NumberInput
            color={NumberInputColor.Orange}
            onChange={setConfirmationNumber}
            value={confirmationNumber}
            size={TextInputSize.MediumLarge}
            centered
            maxDigits={6}
          />
        </View>
      </View>
      <Text color={TextColor.Red} style={styles.errorMessage}>{errorMessage}</Text>
      <View style={styles.buttonContainer}>
        <Button
          color={ButtonColor.Orange}
          size={ButtonSize.Medium}
          onPress={onPressSignUp}
          text={'Sign Up'}
          textBold
          disabled={isLoading}
        />
      </View>
    </ScrollView>
    </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  keyboardViewContainer: {
    flex: 1,
  },
  inner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: "space-around",
    alignItems: 'center',
    marginTop: 60,
    paddingLeft: 36,
    paddingRight: 36,
  },
  headerContainer: {
    marginTop: 36,
  },
  question: {
    marginTop: 20,
    marginBottom: 50,
  },
  label: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 24,
  },
  inputContainer: {
    paddingLeft: 50,
    paddingRight: 50,
  },
  buttonContainer: {
    marginTop: 24,
    marginBottom: 24,
    marginBottom: isSmallWidth ? 32 : 16,
    width: width * .85,
  },
  errorMessage: {
    width: width * .85,
    textAlign: 'center',
  },
});

export default ConfirmationScreen;
