import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';

import {ScreenShell} from '../components/common/ScreenShell';
import {useReportStore} from '../store/reportStore';
import {theme} from '../theme/theme';
import {formatDuration} from '../utils/time';

const renderReportItem = ({item}: {item: any}) => (
  <View style={styles.item}>
    <Text style={styles.date}>{item.dateKey}</Text>
    <Text style={styles.total}>{formatDuration(item.totalSeconds)}</Text>
  </View>
);

export function ReportsScreen() {
  const dailyReports = useReportStore(state => state.dailyReports);

  return (
    <ScreenShell>
      <FlatList
        data={dailyReports}
        keyExtractor={item => item.dateKey}
        ListEmptyComponent={<Text style={styles.empty}>No reports yet.</Text>}
        renderItem={renderReportItem}
      />
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  empty: {
    color: theme.colors.mutedText,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingVertical: 12,
  },
  date: {
    color: theme.colors.text,
  },
  total: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});
