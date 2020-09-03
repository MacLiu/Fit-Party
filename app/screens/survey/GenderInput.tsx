import React from 'react';
import { View, StyleSheet, Image, Dimensions } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

import colors from 'app/assets/colors';
import { Heading3, HeadingColor, Heading2, Heading4 } from 'app/components/Headings';
import { Gender } from 'app/utils/routes';
import { breakpoint375 } from 'app/utils/screenSize';

const { width, height } = Dimensions.get('window');
const isSmallWidth = width < breakpoint375;

type GenderInputProps = {
  onPressMan: () => void;
  onPressWoman: () => void;
  gender: Gender | null;
};

// TODO(danielc): Add haptic feedback
const GenderInput: React.FC<GenderInputProps> = props => {
  return (
    <View style={styles.container}>
      <View style={styles.headingContainer}>
      {isSmallWidth
        ? <Heading3 center color={HeadingColor.Black}>What’s your gender?</Heading3>
        : <Heading2 center color={HeadingColor.Black}>What’s your gender?</Heading2>
      }
      </View>
      <View style={styles.genderContainer}>
        <TouchableWithoutFeedback onPress={props.onPressMan} style={styles.touchableContainer}>
          <View style={styles.imageContainer}>
            {props.gender === Gender.Male
              ? <Image source={require('app/assets/images/survey/manFull.png')} style={styles.image} />
              : <Image source={require('app/assets/images/survey/manEmpty.png')} style={styles.image} />
            }
          </View>
          {isSmallWidth
            ? <Heading4 bold={false} color={HeadingColor.Black}>Male</Heading4>
            : <Heading3 bold={false} color={HeadingColor.Black}>Male</Heading3>
          }
        </TouchableWithoutFeedback>
        <View style={styles.divider} />
        <TouchableWithoutFeedback onPress={props.onPressWoman} style={styles.touchableContainer}>
          <View style={styles.imageContainer}>
            {props.gender === Gender.Female
              ? <Image source={require('app/assets/images/survey/womanFull.png')} style={styles.image} />
              : <Image source={require('app/assets/images/survey/womanEmpty.png')} style={styles.image} />
            }
          </View>
          {isSmallWidth
            ? <Heading4 bold={false} color={HeadingColor.Black}>Female</Heading4>
            : <Heading3 bold={false} color={HeadingColor.Black}>Female</Heading3>
          }
        </TouchableWithoutFeedback>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  genderContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headingContainer: {
    marginBottom: 60,
  },
  touchableContainer: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    paddingTop: height * .02,
    paddingBottom: height * .02,
  },
  image: {
    width: width * .15,
  },
  divider: {
    height: height * .25,
    borderLeftWidth: 2,
    borderLeftColor: colors.lightGray,
    marginLeft: 40,
    marginRight: 40,
  },
});

export default GenderInput;
