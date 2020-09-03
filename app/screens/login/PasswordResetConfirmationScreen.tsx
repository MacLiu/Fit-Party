import React, { useState } from 'react';
import { View, StyleSheet, Keyboard, KeyboardAvoidingView, TouchableWithoutFeedback, ScrollView, Dimensions } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Text, { TextColor } from 'app/components/Text';
import { TextInputSize } from 'app/components/form/TextInput';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { RootStackParamList } from 'app/utils/routes';
import { Heading2, HeadingColor } from 'app/components/Headings';
import { makeRequest, persistToken } from 'app/utils/network';
import CloseButton, { CloseButtonColor } from 'app/components/CloseButton';
import NumberInput, { NumberInputColor } from 'app/components/form/NumberInput';
import { breakpoint375 } from 'app/utils/screenSize';
import LinearGradient from 'react-native-linear-gradient';
import colors from 'app/assets/colors';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import { passwordResetVerifySMSRoute, PasswordResetVerifySMSResponse } from 'app/endpoints/auth/auth';

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type PasswordResetConfirmationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordResetConfirmation'>;
type PasswordResetConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetConfirmation'>;

type PasswordResetConfirmationScreenProps = {
  navigation: PasswordResetConfirmationScreenNavigationProp;
  route: PasswordResetConfirmationScreenRouteProp;
};

const PasswordResetConfirmationScreen = (props: PasswordResetConfirmationScreenProps) => {
  const [confirmationNumber, setConfirmationNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onPressEnter = () => {
    setIsLoading(true);
    setErrorMessage('');
    const { authyID, phoneNumber } = props.route.params;
    makeRequest<PasswordResetVerifySMSResponse>({
      url: passwordResetVerifySMSRoute,
      body: {
        authy_id: authyID,
        sms_code: confirmationNumber,
        phone_number: phoneNumber,
      },
    }).then((resp: PasswordResetVerifySMSResponse) => {
      setIsLoading(false);
      persistToken(resp.access_token).then(() => {
        props.navigation.navigate('PasswordReset', {
          phoneNumber: phoneNumber,
        });
      });
    }).catch(() => {
      setIsLoading(false);
      setErrorMessage('There was an error validating your account, please try again.');
    });
  }
  // TODO(danielc): Add haptic feedback
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.orange, '#ff8474']}
      style={styles.linearGradientContainer}
    >
      <View style={styles.backButton}>
        <BackButton color={BackButtonColor.White} onPress={() => props.navigation.goBack()}/>
      </View>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner}>
            <View style={styles.headingContainer}>
              <Heading2 color={HeadingColor.White}>Forgot Password?</Heading2>
            </View>
            <View style={styles.paragraphContainer}>
              <Text color={TextColor.White} center style={styles.paragraphContent}>Enter your phone number to receive a code to enter a new password.</Text>
            </View>
            <View style={styles.question}>
              <NumberInput
                onChange={setConfirmationNumber}
                value={confirmationNumber}
                size={TextInputSize.Small}
                centered
                maxDigits={6}
                noBorder
                color={NumberInputColor.White}
                placeholder={'Code'}
              />
            </View>
            <Text style={styles.errorMessage} color={TextColor.White}>{errorMessage}</Text>
            <View style={styles.buttonContainer}>
              <Button
                color={ButtonColor.White}
                size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
                onPress={onPressEnter}
                text={'Enter'}
                textBold
                disabled={isLoading}
              />
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  linearGradientContainer: {
    flex: 1,
  },
  backButton: {
    marginTop: 48,
    marginLeft: 20,
    width: 44,
  },
  headingContainer: {
    marginBottom: 12,
  },
  paragraphContainer: {
    maxWidth: width * .75,
    marginBottom: 32,
  },
  paragraphContent: {
    fontSize: 18,
  },
  question: {
    marginBottom: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 32,
    marginBottom: isSmallWidth ? 32 : 16,
    width: width * .85,
  },
  errorMessage: {
    width: width * .85,
    textAlign: 'center',
  },
});

export default PasswordResetConfirmationScreen;
