import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import Text, { TextColor } from 'app/components/Text';
import { breakpoint375 } from 'app/utils/screenSize';

type AuthSlideProps = {
  imageSource: any;
  description: string;
  isTitle: boolean;
};

const { width, height } = Dimensions.get('window');
const isSmallScreen = width < breakpoint375;

const AuthSlide: React.FC<AuthSlideProps> = props => {
  return (
    <View style={styles.container}>
      <View style={[
        styles.imageContainer,
      ]}>
        <Image
          source={props.imageSource}
          style={props.isTitle ? styles.titleImage : styles.image}
        />
      </View>
      <Text 
        style={[
          styles.info,
          props.isTitle ? styles.titleText : styles.text,
        ]}
        color={TextColor.White}
      >
        {props.description}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 50,
    paddingRight: 50,
  },
  imageContainer: {
    marginTop: height * .15,
  },
  titleImage: {
    width: width * .25,
    height: height * .25,
  },
  image: {
    width: width * .8,
    height: height * .25,
    marginBottom: 25,
  },
  titleText: {
    fontSize: isSmallScreen ? 28 : 36,
  },
  text: {
    fontSize: isSmallScreen ? 16 : 18,
  },
  info: {
    textAlign: 'center',
  },
});

export default AuthSlide;
