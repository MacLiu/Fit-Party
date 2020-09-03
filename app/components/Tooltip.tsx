import React from 'react';
import { Image, StyleSheet } from 'react-native';

type TooltipProps = {
  onClick: () => void;
};

const Tooltip: React.FC<TooltipProps> = props => {
  return (
    <Image source={require('app/assets/images/components/tooltip.png')} style={styles.icon} />
  );
};

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
});

export default Tooltip;
