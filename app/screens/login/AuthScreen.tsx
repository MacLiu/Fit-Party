import React from 'react';
import { View, StyleSheet, ImageBackground, Dimensions, Image } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import Swiper from 'react-native-swiper';
import LinearGradient from 'react-native-linear-gradient';

import AuthDot from 'app/screens/login/AuthDot';
import AuthSlide from 'app/screens/login/AuthSlide';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import colors from 'app/assets/colors';
import { RootStackParamList } from 'app/utils/routes';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < breakpoint375;

type AuthScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Auth'>;

type AuthScreenProps = {
  navigation: AuthScreenNavigationProp;
};

const AuthScreen = (props: AuthScreenProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.orange, '#ff8474']}
        style={styles.headerContainer}
      >
        <View>
          <Swiper
            loop={false}
            dot={<AuthDot active={false}/>}
            activeDot={<AuthDot active />}
          >
            <AuthSlide
              imageSource={require('app/assets/images/login/logo.png')}
              description={'Welcome to Evolve'}
              isTitle={true}
            />
            <AuthSlide
              imageSource={require('app/assets/images/onboarding/lifting.png')}
              description={'Evolve uses artificial intelligence to help you achieve your fitness goals through a personalized plan.'}
              isTitle={false}
            />
            <AuthSlide
              imageSource={require('app/assets/images/onboarding/running.png')}
              description={'Our artificial intelligence is based on thousands of workout programs designed by the world’s top trainers.'}
              isTitle={false}
            />
            <AuthSlide
              imageSource={require('app/assets/images/onboarding/abs.png')}
              description={'Each workout is personalized for optimal muscle growth and fat loss.'}
              isTitle={false}
            />
            <AuthSlide
              imageSource={require('app/assets/images/onboarding/finishLine.png')}
              description={'The workout routines are scientifically proven to help you hit your fitness goals faster.'}
              isTitle={false}
            />
          </Swiper>
          <View style={styles.buttonContainer}>
            <Button
              color={ButtonColor.White}
              size={isSmallScreen ? ButtonSize.Small : ButtonSize.Medium}
              onPress={() => props.navigation.navigate('SignUp')}
              text="Sign up"
              textBold
            />
            <Button
              color={ButtonColor.Transparent}
              size={isSmallScreen ? ButtonSize.Small : ButtonSize.Medium}
              onPress={() => props.navigation.navigate('Login')}
              text="Log in"
              textBold
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  imageBackground: {
    height: height,
    width: width,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 36,
    marginLeft: 24,
    marginRight: 24,
  },
});

export default AuthScreen;