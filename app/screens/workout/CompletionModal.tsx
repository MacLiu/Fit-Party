import React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Heading2, HeadingColor } from 'app/components/Headings';
import Button, { ButtonColor, ButtonSize } from 'app/components/Button';
import colors from 'app/assets/colors';

type CompletionModalProps = {
  isVisible: boolean;
  onPressHome: () => void;
  onModalHide: () => void;
  isLoading: boolean;
  isCardio?: boolean;
};

const CompletionModal = (props: CompletionModalProps) => {
  return (
    <Modal
      isVisible={props.isVisible}
      style={styles.modal}
      backdropOpacity={.9}
      hideModalContentWhileAnimating
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={1}
      animationOutTiming={1}
      onModalHide={props.onModalHide}
    >
      <View style={styles.content}>
        {props.isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.orange} />
          </View>
        ) : (
          <View>
            <View style={styles.imageContainer}>
              <FastImage 
                source={require('app/assets/images/main/circleCheck.png')}
                style={{height: 150, width: 150}}
              />
            </View>
            <Heading2 center color={HeadingColor.White}>{props.isCardio ? "Cardio" : "Workout"} Session Complete!</Heading2>
            <View style={styles.buttonContainer}>
              <Button
                color={ButtonColor.Orange}
                size={ButtonSize.Medium}
                onPress={props.onPressHome}
                text={'Home'}
                textBold
              />
            </View>
          </View>
          )
        }
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingTop: 150,
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 52,
  },
  buttonContainer: {
    marginTop: 125,
  }
});

export default CompletionModal;
