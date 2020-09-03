import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Image } from 'react-native';
import { Exercise, baseExerciseImageURLPath } from 'app/endpoints/workout/workout';
import Text, { TextColor } from 'app/components/Text';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Collapsible from 'react-native-collapsible';
import FastImage from 'react-native-fast-image';

type RelatedExerciseRowProps = {
  exercise: Exercise;
  onSelectExercise: () => void;
};

const { width } = Dimensions.get('window');

const RelatedExerciseRow = (props: RelatedExerciseRowProps) => {
  const [isContentVisible, setIsContentVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const onPressTooltip = () => {
    setIsContentVisible(!isContentVisible);
  };
  const imageSource = {uri: baseExerciseImageURLPath + props.exercise.image_url_path};
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.label}>
          <Text style={styles.exerciseName} color={TextColor.Black}>{props.exercise.exercise_name}</Text>
          <TouchableWithoutFeedback
            style={styles.tooltipContainer}
            onPress={onPressTooltip}
          >
            <Image style={styles.carrot} source={require('app/assets/images/main/carrotDown.png')} />
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            color={ButtonColor.Orange}
            size={ButtonSize.XSmall}
            textSize={16}
            noShadow
            text='Select'
            onPress={() => {
              setIsLoading(true);
              props.onSelectExercise();
              setIsLoading(false);
            }}
            isLoading={isLoading}
          />
        </View>
      </View>
      <Collapsible collapsed={!isContentVisible}>
        {isContentVisible &&
          <View style={styles.imageContainer}>
            <FastImage
              source={imageSource}
              style={styles.image}
            />
          </View>
        }
      </Collapsible>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    maxWidth: width * .5,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  tooltipContainer: {
    marginLeft: 12,
  },
  carrot: {
    width: 16,
    height: 16,
  },
  exerciseName: {
    fontSize: 22,
  },
  buttonContainer: {
    width: width * .2,
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  image: {
    width: width * .45,
    height: width * .45,
  },
});

export default RelatedExerciseRow;
