import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  View,
  StyleProp,
  AsyncStorage,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from 'app/assets/colors';
import Text, { TextColor } from 'app/components/Text';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'app/utils/routes';
import { makeRequest, persistToken, NetworkError } from 'app/utils/network';
import CloseButton, { CloseButtonColor } from 'app/components/CloseButton';
import PhoneInput from 'app/components/form/PhoneInput';
import PasswordInput from 'app/components/form/PasswordInput';
import { CreateAccountResponse, createAccountRoute, RequestSMSResponse, requestSMSRoute } from 'app/endpoints/auth/auth';
import { breakpoint375 } from 'app/utils/screenSize';
import { Heading1, HeadingColor, Heading2 } from 'app/components/Headings';

const { height, width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type SignUpScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SignUp'>;

type SignUpScreenProps = {
  navigation: SignUpScreenNavigationProp;
};

const SignUpScreen = (props: SignUpScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [shouldValidate, setShouldValidate] = useState(false);
  const [phoneValidationStatus, setPhoneValidationStatus] = useState(false);
  const [passwordValidationStatus, setPasswordValidationStatus] = useState(false);
  const [confirmPasswordValidationStatus, setConfirmPasswordValidationStatus] = useState(false);
  const onPressContinue = () => {
    setShouldValidate(true);
  }
  useEffect(() => {
    if (!(phoneValidationStatus && passwordValidationStatus && confirmPasswordValidationStatus)) {
      return;
    }
    setShouldValidate(false);
    setIsLoading(true);
    setErrorMessage('');
    makeRequest<CreateAccountResponse>({
      url: createAccountRoute,
      body: {
        phone_number: phoneNumber,
        password: password,
      },
      ignoreToken: true,
    }).then((createAccountResp: CreateAccountResponse) => {
      persistToken(createAccountResp.access_token).then(() => {
        if (!createAccountResp.account_sms_verified) {
          makeRequest<RequestSMSResponse>({
            url: requestSMSRoute,
            body: {
              phone_number: phoneNumber,
            },
          }).then((requestSMSResp: RequestSMSResponse) => {
            setIsLoading(false);
            props.navigation.navigate('Confirmation', {
              authyID: requestSMSResp.authy_id,
            });
          }).catch(() => {
            setIsLoading(false);
            setErrorMessage('There was an error creating your account, please try again.');
          });
        } else {
          setErrorMessage('Account already exists.');
        }
      });
    }).catch((err: NetworkError) => {
      setIsLoading(false);
      if (err.status === 409) {
        return setErrorMessage('An account already exists for that phone number.')
      }
      setErrorMessage('There was an error creating your account, please try again.');
    });
  }, [phoneValidationStatus, passwordValidationStatus, confirmPasswordValidationStatus]);
  // TODO(danielc): Add haptic feedback
  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      colors={[colors.orange, '#ff8474']}
      style={styles.linearGradientContainer}
    >
      <View style={styles.backButton}>
        <CloseButton color={CloseButtonColor.White} onPress={() => props.navigation.goBack()}/>
      </View>
      <KeyboardAvoidingView
        behavior={'padding'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.inner}>
            <View>
              <View style={styles.headerContainer}>
                {isSmallWidth ? 
                  (
                    <Heading2 bold={false} center color={HeadingColor.White}>
                      Ready to <Text color={TextColor.White} bold>Evolve?</Text>
                    </Heading2>
                  ) : (
                    <Heading1 bold={false} center color={HeadingColor.White}>
                      Ready to <Text color={TextColor.White} bold>Evolve?</Text>
                    </Heading1>
                  )
                }
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
                  errorColor={TextColor.White}
                />
              </View>
              <View style={styles.question}>
                <PasswordInput
                  onChange={(value: string) => {
                    setShouldValidate(false);
                    setPassword(value);
                  }}
                  value={password}
                  validationParams={{
                    shouldValidate,
                    showErrorMessage: true,
                    onValidate: (wasSuccessful: boolean) => {
                      if (wasSuccessful) {
                        setPasswordValidationStatus(true);
                      }
                    },
                  }}
                  errorColor={TextColor.White}
                />
              </View>
              <View style={styles.question}>
                <PasswordInput
                  onChange={(value: string) => {
                    setShouldValidate(false);
                    setConfirmedPassword(value);
                  }}
                  value={confirmedPassword}
                  isPasswordConfirmation
                  validationParams={{
                    shouldValidate,
                    showErrorMessage: true,
                    onValidate: (wasSuccessful: boolean) => {
                      if (wasSuccessful) {
                        setConfirmPasswordValidationStatus(true);
                      }
                    },
                    validate: (value: string) => {
                      if (password !== value) {
                        return 'Must match password.'
                      }
                      return null;
                    }
                  }}
                  errorColor={TextColor.White}
                />
              </View>
              <Text style={styles.errorMessage} color={TextColor.White}>{errorMessage}</Text>
              <View style={styles.buttonContainer}>
                <Button
                  color={ButtonColor.White}
                  size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
                  onPress={onPressContinue}
                  text={'Sign up'}
                  textBold
                  disabled={isLoading}
                />
              </View>
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
    alignItems: 'center',
    flex: 1,
    justifyContent: "center",
  },
  linearGradientContainer: {
    flex: 1,
  },
  backButton: {
    marginTop: 48,
    marginLeft: 20,
    width: 44,
  },
  headerContainer: {
    // marginTop: -24,
    marginBottom: height * .04,
    alignItems: 'center',
  },
  question: {
    marginBottom: height * .015,
    marginTop: height * .015,
  },
  label: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 16,
    marginBottom: isSmallWidth ? 32 : 16,
    width: width * .85,
  },
  errorMessage: {
    width: width * .85,
    textAlign: 'center',
  },
  header: {
    fontSize: 38,
    paddingTop: 35,
    textAlign: 'center',
    marginBottom: 42,
  },
});

export default SignUpScreen;
