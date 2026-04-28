import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { PrimaryButton } from '../components/common/PrimaryButton';
import { TimerDisplay } from '../components/timer/TimerDisplay';
import { TimeInputPicker } from '../components/timer/TimeInputPicker';
import { AnimatedTimerRing } from '../components/timer/AnimatedTimerRing';
import { MinimalTimer } from '../components/timer/templates/MinimalTimer';
import { NeonTimer } from '../components/timer/templates/NeonTimer';
import { LinearTimer } from '../components/timer/templates/LinearTimer';
import { BoldTimer } from '../components/timer/templates/BoldTimer';
import { FlipTimer } from '../components/timer/templates/FlipTimer';
import { DotTimer } from '../components/timer/templates/DotTimer';
import { useTimerEngine } from '../hooks/useTimerEngine';
import { useCategoryStore } from '../store/categoryStore';
import { useSettingsStore } from '../store/settingsStore';
import { useTimerStore } from '../store/timerStore';
import { theme } from '../theme/theme';
import { RootDrawerParamList } from '../types/navigation';
import Icon from 'react-native-vector-icons/Ionicons';

export function TimerScreen() {
  useTimerEngine();

  const navigation = useNavigation<DrawerNavigationProp<RootDrawerParamList>>();
  const settings = useSettingsStore(state => state.settings);
  const timerTemplate = useSettingsStore(state => state.settings.timerTemplate);
  const timerTextColor = useSettingsStore(state => state.settings.timerTextColor);
  const backgroundColor = useSettingsStore(state => state.settings.backgroundColor);
  
  const isRunning = useTimerStore(state => state.isRunning);
  const hasStarted = useTimerStore(state => state.hasStarted);
  const remainingSeconds = useTimerStore(state => state.remainingSeconds);
  const initialSeconds = useTimerStore(state => state.initialSeconds);
  const start = useTimerStore(state => state.start);
  const resume = useTimerStore(state => state.resume);
  const pause = useTimerStore(state => state.pause);
  const reset = useTimerStore(state => state.reset);
  const categories = useCategoryStore(state => state.categories);
  const selectedCategoryId = useCategoryStore(state => state.selectedCategoryId);
  const selectedSubcategoryId = useCategoryStore(state => state.selectedSubcategoryId);

  const selectedCategory = categories.find(category => category.id === selectedCategoryId);
  const selectedSubcategory = selectedCategory?.subcategories.find(
    subcategory => subcategory.id === selectedSubcategoryId
  );

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);

  const setupSeconds = hours * 3600 + minutes * 60 + seconds;
  const displaySeconds = hasStarted ? remainingSeconds : setupSeconds;

  const handleReset = () => {
    reset();
    setHours(0);
    setMinutes(25);
    setSeconds(0);
  };

  const handleTimeChange = (h: number, m: number, s: number) => {
    setHours(h);
    setMinutes(m);
    setSeconds(s);
  };

  const renderActiveTemplate = () => {
    if (!hasStarted) {
      return (
        <TimeInputPicker 
          hours={hours} 
          minutes={minutes} 
          seconds={seconds} 
          onChange={handleTimeChange} 
        />
      );
    }

    const commonProps = { 
      remainingSeconds: displaySeconds, 
      totalSeconds: initialSeconds, 
      color: timerTextColor 
    };

    switch (timerTemplate) {
      case 'minimal': return <MinimalTimer {...commonProps} />;
      case 'neon': return <NeonTimer {...commonProps} />;
      case 'linear': return <LinearTimer {...commonProps} />;
      case 'bold': return <BoldTimer {...commonProps} />;
      case 'flip': return <FlipTimer {...commonProps} />;
      case 'dot': return <DotTimer {...commonProps} />;
      case 'ring': 
      default:
        return (
          <View style={styles.ringWrapper}>
            <AnimatedTimerRing {...commonProps} color={theme.colors.accent} />
            <View style={styles.displayOverlay}>
              <TimerDisplay seconds={displaySeconds} color={timerTextColor} />
            </View>
          </View>
        );
    }
  };

  const dynamicContainerStyle = [styles.container, { backgroundColor: backgroundColor }];
  const dynamicIconStyle = { marginRight: 6 };

  return (
    <View style={dynamicContainerStyle}>
      
      <View style={styles.topSection}>
        <Pressable
          style={styles.categoryPill}
          onPress={() => navigation.navigate('CategoryManager')}>
          <Icon name="grid-outline" size={16} color={theme.colors.accent} style={dynamicIconStyle} />
          <Text style={styles.categoryText}>
            {selectedCategory?.name ?? 'Select Category'}
            {selectedSubcategory ? ` / ${selectedSubcategory.name}` : ''}
          </Text>
        </Pressable>
      </View>

      <View style={styles.timerWrapper}>
        <View style={styles.timerContainer} key={timerTemplate}>
          {renderActiveTemplate()}
        </View>
      </View>

      <View style={styles.spacer} />

      <View style={styles.actions}>
        {!hasStarted ? (
          <PrimaryButton
            label="Start Focus"
            iconName="play"
            disabled={setupSeconds === 0}
            onPress={() => {
              if (setupSeconds > 0) {
                start(
                  setupSeconds,
                  {
                    categoryId: selectedCategoryId,
                    subcategoryId: selectedSubcategoryId,
                    durationSeconds: setupSeconds,
                    unlockDifficulty: 'none',
                    alertEnabled: true,
                    notificationEnabled: true,
                  },
                );
              }
            }}
          />
        ) : (
          <>
            <PrimaryButton
              label={isRunning ? 'Pause' : 'Resume'}
              iconName={isRunning ? 'pause' : 'play'}
              variant={isRunning ? 'primary' : 'danger'}
              onPress={() => {
                if (isRunning) pause();
                else resume();
              }}
            />
            <PrimaryButton 
              label="Reset" 
              iconName="refresh" 
              variant="ghost" 
              onPress={handleReset} 
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  topSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  categoryPill: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  categoryText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  timerWrapper: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  spacer: {
    flex: 1,
  },
  actions: {
    gap: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  displayOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
