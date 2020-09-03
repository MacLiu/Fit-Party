import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';

import Text, { TextColor } from 'app/components/Text';
import colors from 'app/assets/colors';

export enum ProgressBarSection {
  Gender = 'Gender',
  Age = 'Age',
  Weight = 'Weight',
  Height = 'Height',
  Experience = 'Experience',
  Focus = 'Focus',
};

const order = [
  ProgressBarSection.Gender,
  ProgressBarSection.Age,
  ProgressBarSection.Weight,
  ProgressBarSection.Height,
  ProgressBarSection.Experience,
  ProgressBarSection.Focus,
];

type ProgressBarProps = {
  section: ProgressBarSection;
};

const ProgressBar: React.FC<ProgressBarProps> = props => {
  const index = order.findIndex(s => s === props.section);
  return (
    <View style={progressBarStyles.container}>
      {order.map((section, i) =>
        <ProgressBarEntry
          key={i}
          index={i+1}
          section={section}
          isActive={i <= index}
          showLine={i !== 0}
        />
      )}
    </View>
  )
};

const progressBarStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

type ProgressBarEntryProps = {
  index: number;
  section: ProgressBarSection;
  isActive: boolean;
  showLine: boolean;
};

const ProgressBarEntry: React.FC<ProgressBarEntryProps> = props => {
  return (
    <View style={progressBarEntryStyles.container}>
      <View style={progressBarEntryStyles.content}>
        <View style={[progressBarEntryStyles.circle, props.isActive ? progressBarEntryStyles.activeBorder : progressBarEntryStyles.inactiveBorder]}>
          <Text
            style={progressBarEntryStyles.index}
            color={props.isActive ? TextColor.Orange : TextColor.LightGray}
          >
            {props.index}
          </Text>
        </View>
        <Text
          style={progressBarEntryStyles.sectionName}
          color={props.isActive ? TextColor.Orange : TextColor.LightGray}
        >
          {props.section}
        </Text>
      </View>
    </View>
  );
};

const progressBarEntryStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  horizontalDivider: {
    borderBottomColor: colors.lightGray,
    borderBottomWidth: 2,
    width: Dimensions.get('window').width * 0.2,
  },
  content: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
  },
  activeBorder: {
    borderColor: colors.orange,
  },
  inactiveBorder: {
    borderColor: colors.lightGray,
  },
  circle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: Dimensions.get('window').width * 0.04,
    width: Dimensions.get('window').width * 0.08,
    height: Dimensions.get('window').width * 0.08,
  },
  index: {
    fontSize: 12,
  },
  sectionName: {
    fontSize: 9,
  },
});

export default ProgressBar;
