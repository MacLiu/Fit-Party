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
import { makeRequest, NetworkError } from 'app/utils/network';
import colors from 'app/assets/colors';
import { RequestSMSResponse, resetPasswordRoute } from 'app/endpoints/auth/auth';
import { breakpoint375 } from 'app/utils/screenSize';
import BackButton, { BackButtonColor } from 'app/components/BackButton';
import { Heading2, HeadingColor } from 'app/components/Headings';
import PasswordInput from 'app/components/form/PasswordInput';
import { RouteProp } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type PasswordResetScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordReset'>;
type PasswordResetScreenRouteProp = RouteProp<RootStackParamList, 'PasswordReset'>;

type PasswordResetScreenProps = {
  navigation: PasswordResetScreenNavigationProp;
  route: PasswordResetScreenRouteProp;
};

const PasswordResetScreen = (props: PasswordResetScreenProps) => {
  const [password, setPassword] = useState('');
  const [confirmedPassword, setConfirmedPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const onPressContinue = () => {
    if (password !== confirmedPassword) {
      return setErrorMessage('Passwords must match');
    }
    setErrorMessage('');
    setIsLoading(true);
    makeRequest({
      url: resetPasswordRoute,
      body: {
        phone_number: props.route.params.phoneNumber,
        password: password,
      },
      method: 'PUT',
    }).then(() => {
      setIsLoading(false);
      props.navigation.navigate('Home');
    }).catch((err: NetworkError) => {
      console.log('err', err)
      setIsLoading(false);
      setErrorMessage('There was an error, please try again.');
    });
  }
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
                <Heading2 color={HeadingColor.White}>Reset Password</Heading2>
              </View>
              <View style={styles.question}>
                <PasswordInput
                  onChange={(value: string) => setPassword(value)}
                  value={password}
                  errorColor={TextColor.White}
                />
              </View>
              <View style={styles.question}>
                <PasswordInput
                  onChange={(value: string) => setConfirmedPassword(value)}
                  value={confirmedPassword}
                  isPasswordConfirmation
                  errorColor={TextColor.White}
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
    width: width,
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

export default PasswordResetScreen;
