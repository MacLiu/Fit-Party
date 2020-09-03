import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import colors from 'app/assets/colors';

const LoadingScreen = () => {
  return (
    <View style={styles.loading}>
      <ActivityIndicator size="large" color={colors.orange} />
    </View>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: colors.white,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingScreen;
