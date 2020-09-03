import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { Heading2, HeadingColor } from 'app/components/Headings';
import { View, StyleSheet, ActivityIndicator, Dimensions, ActionSheetIOS } from 'react-native';
import colors from 'app/assets/colors';
import { makeRequest } from 'app/utils/network';
import { GetUserInfoResponse, userInfoRoute, getDisplayNameForGender, getGenderFromDisplayName, getDisplayNameForHeight, getHeightInchesForDisplayName, getDisplayNameForTrainingExperience, ExperienceDisplayName, getTrainingExperienceForDisplayName, getDisplayNameForTrainingGoal, TrainingGoalDisplayName, getTrainingGoalForDisplayName, UpdateUserInfoResponse, persistUserInfo } from 'app/endpoints/user/user';
import SettingsTextRow from 'app/screens/settings/SettingsTextRow';
import SettingsDropdownRow from 'app/screens/settings/SettingsDropdownRow';
import { Gender, Experience, TrainingGoal } from 'app/utils/routes';
import SettingsNumberRow from 'app/screens/settings/SettingsNumberRow';
import HeightModal from 'app/screens/settings/HeightModal';
import SettingsRow from 'app/screens/settings/SettingsRow';
import Text from 'app/components/Text';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const { height, width } = Dimensions.get('window');

const SettingsScreen = () => {
  const [userInfo, setUserInfo] = useState<GetUserInfoResponse | undefined>(undefined);
  const genderOptions = Object.keys(Gender).map(g => getDisplayNameForGender(Gender[g as keyof typeof Gender]));
  const experienceOptions = Object.keys(Experience).map(e => getDisplayNameForTrainingExperience(Experience[e as keyof typeof Experience]));
  const goalOptions = Object.keys(TrainingGoal).map(g => getDisplayNameForTrainingGoal(TrainingGoal[g as keyof typeof TrainingGoal]));
  const [isHeightModalOpen, setIsHeightModalOpen] = useState(false);
  useEffect(() => {
    makeRequest<GetUserInfoResponse>({
      method: 'GET',
      url: userInfoRoute,
    }).then((resp: GetUserInfoResponse) => {
      setUserInfo(resp);
    });
  }, [])
  const updateUserInfo = (userInfo: GetUserInfoResponse) => {
    makeRequest<UpdateUserInfoResponse>({
      method: 'PUT',
      url: userInfoRoute,
      body: userInfo,
    }).then(() => {
      persistUserInfo({
        name: userInfo.name,
        gender: userInfo.gender,
        heightInches: userInfo.height_in_inches,
        experience: userInfo.training_experience,
        birthday: new Date(userInfo.birth_date),
        weightPounds: null,
        trainingGoal: userInfo.training_goal,
      });
    }).catch(() => {
      // TODO(danielc): handle error
    });
  }
  let content;
  if (!userInfo) {
    content = (
      <View style={styles.loadingContainer}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.orange} />
        </View>
      </View>
    );  
  } else {
    content = (
      <View style={styles.content}>
        <SettingsTextRow
          label='Name'
          value={userInfo.name}
          onChangeText={(value: string) => setUserInfo({
            ...userInfo,
            name: value,
          })}
          onBlur={() => updateUserInfo(userInfo)}
        />
        <SettingsDropdownRow
          label='Gender'
          value={getDisplayNameForGender(userInfo.gender)}
          options={genderOptions}
          onPressValue={(value: string) => {
            setUserInfo({
              ...userInfo,
              gender: getGenderFromDisplayName(value),
            });
            updateUserInfo({
              ...userInfo,
              gender: getGenderFromDisplayName(value),
            });
          }}
        />
        <SettingsRow label='Height'>
          <TouchableWithoutFeedback
            onPress={() => {
              setIsHeightModalOpen(true);
            }}
          >
            <Text style={styles.text}>{getDisplayNameForHeight(userInfo.height_in_inches)}</Text>
          </TouchableWithoutFeedback>
        </SettingsRow>
        <SettingsDropdownRow
          label='Experience'
          value={getDisplayNameForTrainingExperience(userInfo.training_experience)}
          options={experienceOptions}
          onPressValue={(value: string) => {
            setUserInfo({
              ...userInfo,
              training_experience: getTrainingExperienceForDisplayName(value as any as ExperienceDisplayName),
            });
            updateUserInfo({
              ...userInfo,
              training_experience: getTrainingExperienceForDisplayName(value as any as ExperienceDisplayName),
            });
          }}
        />
        <SettingsDropdownRow
          label='Goal'
          value={getDisplayNameForTrainingGoal(userInfo.training_goal)}
          options={goalOptions}
          onPressValue={(value: string) => {
            setUserInfo({
              ...userInfo,
              training_goal: getTrainingGoalForDisplayName(value as any as TrainingGoalDisplayName),
            });
            updateUserInfo({
              ...userInfo,
              training_goal: getTrainingGoalForDisplayName(value as any as TrainingGoalDisplayName),
            });
          }}
        />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <LinearGradient
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        colors={[colors.orange, '#ff8474']}
        style={styles.headerContainer}
      >
        <Heading2 color={HeadingColor.White}>Settings</Heading2>
      </LinearGradient>
      {content}
      {!!userInfo && isHeightModalOpen &&
        <HeightModal
          isVisible={isHeightModalOpen}
          heightInches={userInfo.height_in_inches}
          onPressSetHeight={(height: number) => {
            setUserInfo({
            ...userInfo,
            height_in_inches: height,
            });
            updateUserInfo({
              ...userInfo,
              height_in_inches: height,
            });
          }}
          onClose={() => setIsHeightModalOpen(false)}
        />
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: height * .1,
    paddingLeft: width * .075,
    paddingBottom: height * .05,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    marginTop: -20,
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    backgroundColor: colors.white,
    borderRadius: 20,
    marginTop: -20,
  },
  text: {
    fontSize: 18,
  }
});

export default SettingsScreen;
