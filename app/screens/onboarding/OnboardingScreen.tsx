import React, { useState } from 'react';
import Swiper from 'react-native-swiper';

import Dot from 'app/screens/onboarding/Dot';
import Slide from 'app/screens/onboarding/Slide';
import { StyleSheet, View } from 'react-native';
import colors from 'app/assets/colors';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'app/utils/routes';

type OnboardingcreenNavigationProp = StackNavigationProp<RootStackParamList, 'Onboarding'>;

type OnboardingScreenProps = {
  navigation: OnboardingcreenNavigationProp;
};

// TODO(danielc): find out how to pass image source variable into require()
const OnboardingScreen = (props: OnboardingScreenProps) => {
  const [showButton, setShowButton] = useState(false);
  const onIndexChanged = (index: number) => {
    setShowButton(index === 3);
  };
  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <Swiper
          loop={false}
          dot={<Dot active={false}/>}
          activeDot={<Dot active />}
          onIndexChanged={onIndexChanged}
        >
          <Slide
            imageSource={require('app/assets/images/onboarding/lifting.png')}
            description={'Evolve uses artificial intelligence to help you get closer to your goals week by week!'}
          />
          <Slide
            imageSource={require('app/assets/images/onboarding/running.png')}
            description={'Your workout routines are personal and always evolving. We keep things fresh with new workout routines each week.'}
          />
          <Slide
            imageSource={require('app/assets/images/onboarding/abs.png')}
            description={'Our algorithm analyzes your weekly performance to build workout routines with gradually increasing intensity.'}
          />
          <Slide
            imageSource={require('app/assets/images/onboarding/finishLine.png')}
            description={'Start your fitness journey with Evolve and become leaner and stronger each week!'}
          />
        </Swiper>
      </View>
      <View style={styles.buttonContainer}>
        {showButton && 
          <Button
            color={ButtonColor.Orange}
            size={ButtonSize.Medium}
            onPress={() => props.navigation.navigate('NameSurvey')}
            text={'Get Started!'}
            textBold
          />
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    backgroundColor: colors.white,
  },
  swiperContainer: {
    flex: .85,
  },
  buttonContainer: {
    marginTop: 20,
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
  }
})

export default OnboardingScreen;
