import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

import colors from 'app/assets/colors';
import Text from 'app/components/Text';

type SlideProps = {
  imageSource: any; // TODO:(danielc): type this better
  description: string;
};

const Slide: React.FC<SlideProps> = props => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={props.imageSource} style={styles.image} />
      </View>
      <Text bold style={styles.info}>
        {props.description}
      </Text>
    </View>
  );
};

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.white,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 50,
    paddingRight: 50,
  },
  imageContainer: {
    height: height * .45,
    marginTop: height * .1,
  },
  image: {
    transform: [{ scale: .4 }],
  },
  info: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: -20,
  },
});

export default Slide;
