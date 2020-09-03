import React, { useState } from 'react';
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

import Text, { TextColor } from 'app/components/Text';
import TextInput, { TextInputType, TextInputSize } from 'app/components/form/TextInput';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'app/utils/routes';
import { makeRequest, persistToken, NetworkError } from 'app/utils/network';
import colors from 'app/assets/colors';
import CloseButton, { CloseButtonColor } from 'app/components/CloseButton';
import PhoneInput from 'app/components/form/PhoneInput';
import PasswordInput from 'app/components/form/PasswordInput';
import { LoginResponse, RequestSMSResponse, loginRoute, requestSMSRoute } from 'app/endpoints/auth/auth';
import { GetUserInfoResponse, userInfoRoute, persistUserInfo, isUserInfoSet } from 'app/endpoints/user/user';
import { clearCachedWorkoutSession, clearCachedWorkoutResponse } from 'app/endpoints/workout/workout';
import { breakpoint375 } from 'app/utils/screenSize';

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type LoginScreenProps = {
  navigation: LoginScreenNavigationProp;
};

const LoginScreen = (props: LoginScreenProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onPressContinue = () => {
    makeRequest<LoginResponse>({
      url: loginRoute,
      body: {
        phone_number: phoneNumber,
        password: password,
      },
      ignoreToken: true,
    }).then((loginResp: LoginResponse) => {
      persistToken(loginResp.access_token).then(() => {
        if (!loginResp.account_sms_verified) {
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
          });
        }
        makeRequest<GetUserInfoResponse>({
          method: 'GET',
          url: userInfoRoute,
        }).then((resp: GetUserInfoResponse) => {
          if (!isUserInfoSet(resp)) {
            props.navigation.navigate('NameSurvey');
          }
        }).catch(() => {
          // TODO(danielc): handle error
        });
        setIsLoading(false);
        props.navigation.navigate('Home');
      })
    }).catch((err: NetworkError) => {
      setIsLoading(false);
      if (err.status === 401) {
        return setErrorMessage('Incorrect username/password.');
      } else if (err.status === 404) {
        return setErrorMessage('No account found for phone number.')
      }
      setErrorMessage('There was an error signing in, please try again.');
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
                  <Image source={require('app/assets/images/login/small_logo.png')}/>
                </View>
                <View style={styles.question}>
                  <PhoneInput
                    onChange={setPhoneNumber}
                    value={phoneNumber}
                  />
                </View>
                <View style={styles.question}>
                  <PasswordInput
                    onChange={setPassword}
                    value={password}
                  />
                </View>
                <Text style={styles.errorMessage} color={TextColor.White}>{errorMessage}</Text>
                <View style={styles.buttonContainer}>
                  <Button
                    color={ButtonColor.White}
                    size={isSmallWidth ? ButtonSize.Small : ButtonSize.Medium}
                    onPress={onPressContinue}
                    text={'Log in'}
                    textBold
                    disabled={isLoading}
                  />
                </View>
                <TouchableWithoutFeedback
                  onPress={() => {
                    props.navigation.navigate('ForgotPassword')
                  }}
                >
                  <View style={styles.forgotPasswordContainer}>
                    <Text color={TextColor.White} underline style={styles.forgotPassword}>Forgot Password?</Text>
                  </View>
                </TouchableWithoutFeedback>
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
    justifyContent: "space-around",
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
    marginTop: -24,
    marginBottom: 48,
    alignItems: 'center',
  },
  question: {
    marginBottom: 12,
    marginTop: 12,
  },
  label: {
    fontSize: 18,
  },
  buttonContainer: {
    marginTop: 16,
    width: width * .85,
  },
  forgotPasswordContainer: {
    marginTop: 32,
    marginBottom: isSmallWidth ? 32 : 16,
  },
  forgotPassword: {
    fontSize: 16,
    textAlign: 'center',
  },
  errorMessage: {
    width: width * .85,
    textAlign: 'center',
  },
});

export default LoginScreen;
