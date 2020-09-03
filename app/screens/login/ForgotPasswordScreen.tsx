import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import Text, { TextColor } from 'app/components/Text';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'app/utils/routes';
import { makeRequest, persistToken, NetworkError } from 'app/utils/network';
import colors from 'app/assets/colors';
import PhoneInput from 'app/components/form/PhoneInput';
import { LoginResponse, RequestSMSResponse, loginRoute, requestSMSRoute, passwordResetRequestSMSRoute } from 'app/endpoints/auth/auth';
import { GetUserInfoResponse, userInfoRoute, isUserInfoSet } from 'app/endpoints/user/user';
import { breakpoint375 } from 'app/utils/screenSize';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import { Heading2, HeadingColor } from 'app/components/Headings';

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type ForgotPasswordScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ForgotPassword'>;

type ForgotPasswordScreenProps = {
  navigation: ForgotPasswordScreenNavigationProp;
};

const ForgotPasswordScreen = (props: ForgotPasswordScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);
  const [phoneValidationStatus, setPhoneValidationStatus] = useState(false);
  const onPressContinue = () => {
    setShouldValidate(true);
  }
  useEffect(() => {
    if (!phoneValidationStatus) {
      return;
    }
    setShouldValidate(false);
    setIsLoading(true);
    setErrorMessage('');
    makeRequest<RequestSMSResponse>({
      url: passwordResetRequestSMSRoute,
      body: {
        phone_number: phoneNumber,
      },
    }).then((requestSMSResp: RequestSMSResponse) => {
      setIsLoading(false);
      props.navigation.navigate('PasswordResetConfirmation', {
        authyID: requestSMSResp.authy_id,
        phoneNumber: phoneNumber,
      });
    }).catch(() => {
      setIsLoading(false);
      setErrorMessage('There was an error, please try again.');
    });
  }, [phoneValidationStatus])
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
                <PhoneInput
                  onChange={(value: string) => {
                    setShouldValidate(false);
                    setPhoneNumber(value);
                  }}
                  value={phoneNumber}
                  validationParams={{
                    shouldValidate,
                    showErrorMessage: true,
                    onValidate: (wasSuccessful: boolean) => {
                      if (wasSuccessful) {
                        setPhoneValidationStatus(true);
                      }
                    },
                  }}
                />
              </View>
              <Text style={styles.errorMessage} color={TextColor.White}>{errorMessage}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  color={ButtonColor.White}
                  size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
                  onPress={onPressContinue}
                  text={'Get code'}
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

export default ForgotPasswordScreen;
