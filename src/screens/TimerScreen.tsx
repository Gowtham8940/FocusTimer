import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';

import {PrimaryButton} from '../components/common/PrimaryButton';
import {TimerDisplay} from '../components/timer/TimerDisplay';
import {useTimerEngine} from '../hooks/useTimerEngine';
import {useCategoryStore} from '../store/categoryStore';
import {useSettingsStore} from '../store/settingsStore';
import {useTimerStore} from '../store/timerStore';
import {theme} from '../theme/theme';
import {RootStackParamList} from '../types/navigation';

const DEFAULT_DURATION = 25 * 60;

export function TimerScreen() {
  useTimerEngine();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const settings = useSettingsStore(state => state.settings);
  const isRunning = useTimerStore(state => state.isRunning);
  const hasStarted = useTimerStore(state => state.hasStarted);
  const remainingSeconds = useTimerStore(state => state.remainingSeconds);
  const start = useTimerStore(state => state.start);
  const resume = useTimerStore(state => state.resume);
  const pause = useTimerStore(state => state.pause);
  const reset = useTimerStore(state => state.reset);
  const categories = useCategoryStore(state => state.categories);
  const selectedCategoryId = useCategoryStore(state => state.selectedCategoryId);
  const selectedSubcategoryId = useCategoryStore(
    state => state.selectedSubcategoryId,
  );
  const displaySeconds = hasStarted ? remainingSeconds : DEFAULT_DURATION;
  const selectedCategory = categories.find(
    category => category.id === selectedCategoryId,
  );
  const selectedSubcategory = selectedCategory?.subcategories.find(
    subcategory => subcategory.id === selectedSubcategoryId,
  );

  return (
    <View style={[styles.container, {backgroundColor: settings.backgroundColor}]}>
      <View style={styles.timerContainer}>
        <TimerDisplay seconds={displaySeconds} color={settings.timerTextColor} />
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.categoryPill}
          onPress={() => navigation.navigate('CategoryManager')}>
          <Text style={styles.categoryText}>
            {selectedCategory?.name ?? 'Category'}
            {selectedSubcategory ? ` / ${selectedSubcategory.name}` : ''}
          </Text>
        </Pressable>
        <PrimaryButton
          label={isRunning ? 'Pause' : 'Play'}
          onPress={() => {
            if (isRunning) {
              pause();
              return;
            }

            if (hasStarted && remainingSeconds > 0) {
              resume();
              return;
            }

            start(
              DEFAULT_DURATION,
              {
                categoryId: selectedCategoryId,
                subcategoryId: selectedSubcategoryId,
                durationSeconds: DEFAULT_DURATION,
                unlockDifficulty: 'none',
                alertEnabled: true,
                notificationEnabled: true,
              },
            );
          }}
        />
        <PrimaryButton label="Reset" onPress={reset} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  timerContainer: {
    flex: 0.8,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  actions: {
    gap: 12,
    marginBottom: 10,
  },
  categoryPill: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  categoryText: {
    color: theme.colors.text,
    fontSize: 14,
  },
});
