import React, { useEffect, useState } from 'react';
import { StyleSheet, Dimensions, View, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

import { Heading2, HeadingColor } from 'app/components/Headings';

import colors from 'app/assets/colors';
import { makeRequest, NetworkError } from 'app/utils/network';
import { getCalorieLogsRoute, GetCalorieLogsResponse, persistCalorieLogs, getCachedCalorieLogs } from 'app/endpoints/progress/calories';
import { stringToLocalDate, getDayAbbreviation } from 'app/utils/datetime';
import { useFocusEffect } from '@react-navigation/native';

const weekDataTest = [
  {
    value: 120,
    label: 'Su',
  },
  {
    value: 200,
    label: 'M',
  },
  {
    value: 500,
    label: 'Tu',
  },
  {
    value: 325,
    label: 'W',
  },
  {
    value: 460,
    label: 'Th',
  },
  {
    value: 150,
    label: 'F',
  },
  {
    value: 275,
    label: 'Sa',
  },
];

const { height, width } = Dimensions.get('window');
const contentInset = { top: height * .05, bottom: height * .05 };
const xAxisHeight = height * .05;
const xAxisMarginTop = 0;
const chartWidth = width * .75;

type BarChartData = {
  value: number;
  label: string;
};

const ProgressScreen = () => {
  const [calorieLogs, setCalorieLogs] = useState<GetCalorieLogsResponse | undefined>(undefined);
  useFocusEffect(
    React.useCallback(() => {
      getCachedCalorieLogs().then((logs) => {
        if (logs) {
          setCalorieLogs(logs);
          return;
        }
        makeRequest<GetCalorieLogsResponse>({
          method: 'GET',
          url: getCalorieLogsRoute,
        }).then((resp: GetCalorieLogsResponse) => {
          setCalorieLogs(resp);
          persistCalorieLogs(resp);
        }).catch((err: NetworkError) => {
          // TODO: handle error
        });
      })
    }, [])
  )
  if (!calorieLogs) {
    return (
      <LinearGradient
        colors={[colors.orange, '#ff8474']}
        style={styles.container}
      >
        <View style={styles.loadingContainer}>
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.white} />
          </View>
        </View>
      </LinearGradient>
    );
  }
  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  // Build map from date to total calories logged on that date.
  const weekLogs = calorieLogs
    .filter(cl => stringToLocalDate(cl.logged_at) > oneWeekAgo.toLocaleDateString())
    .reduce<Map<string, number>>((accu: Map<string, number>, cl) => {
      const localDate = stringToLocalDate(cl.logged_at);
      accu.set(localDate, (accu.get(localDate) || 0) + parseInt(cl.calories));
      return accu;
    }, new Map<string, number>());
  let weekData: Array<BarChartData> = [];
  // Build data to pass into bar chart.
  for (let i = 0; i < 7; i++) {
    oneWeekAgo.setDate(oneWeekAgo.getDate() + 1);
    weekData.push({
      value: weekLogs.get(oneWeekAgo.toLocaleDateString()) || 0,
      label: getDayAbbreviation(new Date(oneWeekAgo.toLocaleDateString())),
    });
  }
  const numTicks = Math.ceil(Math.max(...Array.from(weekLogs.values())) / 100) + 1;
  let weekChartYAxisData: Array<number> = [];
  for (let i = 0; i < numTicks; i++) {
    weekChartYAxisData.push(i * 100);
  }
  return (
    <LinearGradient
      colors={[colors.orange, '#ff8474']}
      style={styles.container}
    >
      <View style={styles.headingContainer}>
        <Heading2 color={HeadingColor.White} center>Calories Burned</Heading2>
      </View>
      <View style={styles.chartContainer}>
        <YAxis
          style={styles.yAxis}
          data={weekChartYAxisData}
          contentInset={contentInset}
          svg={{ fontSize: 14, fill: colors.white }}
          numberOfTicks={numTicks}
        />
        <View style={styles.barChartContainer}>
          <BarChart
            data={weekData}
            svg={{
              fill: 'rgba(255,255,255,0.4)',
              strokeLinejoin: 'round',
              strokeLinecap: 'round',
            }}
            style={styles.chart}
            spacingInner={.2}
            yAccessor={({ item }) => item.value}
            contentInset={contentInset}
            numberOfTicks={numTicks}
            yMin={0}
            yMax={Math.max(...weekChartYAxisData)}
          >
            <Grid
              svg={{ stroke: 'rgba(255,255,255,0.4)' }}
            />
          </BarChart>
          <XAxis
            style={styles.xAxis}
            data={weekData}
            xAccessor={({ index }) => index}
            svg={{ fontSize: 14, fill: colors.white }}
            formatLabel={(_, index) => weekData[ index ].label}
            scale={scale.scaleBand}
            spacingInner={0.2}
          />
        </View>
      </View>
      
    </LinearGradient>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    marginTop: -20,
  },
  headingContainer: {
    marginBottom: height * .05,
    marginTop: height * .05,
  },
  chartContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    width: chartWidth,
    height: height * .6,
  },
  barChartContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 12,
  },
  yAxis: {
    marginBottom: xAxisHeight + xAxisMarginTop,
  },
  chart: {
   flex: 1,
  },
  xAxis: {
    marginTop: xAxisMarginTop,
    width: chartWidth,
    height: xAxisHeight,
  },
});

export default ProgressScreen;
