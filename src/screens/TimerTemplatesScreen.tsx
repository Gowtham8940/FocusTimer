import React from 'react';
import { View, StyleSheet, Text, Pressable, ScrollView } from 'react-native';
import { useSettingsStore } from '../store/settingsStore';
import { theme } from '../theme/theme';
import Icon from 'react-native-vector-icons/Ionicons';
import { AnimatedTimerRing } from '../components/timer/AnimatedTimerRing';
import { MinimalTimer } from '../components/timer/templates/MinimalTimer';
import { NeonTimer } from '../components/timer/templates/NeonTimer';
import { LinearTimer } from '../components/timer/templates/LinearTimer';
import { BoldTimer } from '../components/timer/templates/BoldTimer';
import { FlipTimer } from '../components/timer/templates/FlipTimer';
import { DotTimer } from '../components/timer/templates/DotTimer';

export function TimerTemplatesScreen() {
  const settings = useSettingsStore(state => state.settings);
  const updateSettings = useSettingsStore(state => state.updateSettings);

  const templates = [
    { id: 'ring', name: 'Ring Animation', desc: 'Classic glowing circular progress' },
    { id: 'minimal', name: 'Digital Minimal', desc: 'Clean, distraction-free cards' },
    { id: 'neon', name: 'Neon Pulse', desc: 'Glowing, breathing neon numbers' },
    { id: 'linear', name: 'Linear Drain', desc: 'Sleek horizontal progress bar' },
    { id: 'bold', name: 'Big Bold', desc: 'High-impact typography' },
    { id: 'flip', name: 'Modern Flip', desc: 'Classic card-based digital clock' },
    { id: 'dot', name: 'Focus Dot', desc: 'Abstract shrinking focus circle' },
  ];

  const commonProps = { remainingSeconds: 1500, totalSeconds: 3000, color: theme.colors.accent };

  const renderPreview = (id: string) => {
    switch (id) {
      case 'ring': 
        return <AnimatedTimerRing {...commonProps} size={80} />;
      case 'minimal': 
        return <View style={styles.previewMinimal}><MinimalTimer {...commonProps} /></View>;
      case 'neon': 
        return <View style={styles.previewNeon}><NeonTimer {...commonProps} /></View>;
      case 'linear': 
        return <View style={styles.previewLinear}><LinearTimer {...commonProps} /></View>;
      case 'bold': 
        return <View style={styles.previewBold}><BoldTimer {...commonProps} /></View>;
      case 'flip': 
        return <View style={styles.previewFlip}><FlipTimer {...commonProps} /></View>;
      case 'dot': 
        return <View style={styles.previewDot}><DotTimer {...commonProps} /></View>;
      default: return null;
    }
  };

  const dynamicContainerStyle = { backgroundColor: settings.backgroundColor || '#000' };
  const dynamicHeaderStyle = { color: settings.timerTextColor || '#fff' };

  return (
    <ScrollView style={[styles.container, dynamicContainerStyle]} contentContainerStyle={styles.content}>
      <Text style={[styles.header, dynamicHeaderStyle]}>Timer Templates</Text>
      <Text style={styles.subtext}>Choose your visual focus style.</Text>

      <View style={styles.grid}>
        {templates.map(tpl => {
          const isActive = settings.timerTemplate === tpl.id;
          
          return (
            <Pressable
              key={tpl.id}
              style={[styles.card, isActive ? styles.activeCard : {}]}
              onPress={() => updateSettings({ timerTemplate: tpl.id as any })}>
              
              <View style={styles.previewBox}>
                {renderPreview(tpl.id)}
              </View>

              <View style={styles.info}>
                <View style={styles.titleRow}>
                  <Text style={styles.name}>{tpl.name}</Text>
                  {isActive && <Icon name="checkmark-circle" size={20} color={theme.colors.accent} />}
                </View>
                <Text style={styles.desc}>{tpl.desc}</Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 20,
    marginBottom: 8,
  },
  subtext: {
    color: theme.colors.mutedText,
    fontSize: 16,
    marginBottom: 30,
  },
  grid: {
    gap: 16,
  },
  card: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
  },
  activeCard: {
    borderColor: theme.colors.accent,
    backgroundColor: 'rgba(79, 163, 255, 0.03)',
  },
  previewBox: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  info: {
    padding: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.text,
  },
  desc: {
    fontSize: 14,
    color: theme.colors.mutedText,
    lineHeight: 20,
  },
  previewMinimal: { transform: [{ scale: 0.4 }] },
  previewNeon: { transform: [{ scale: 0.5 }] },
  previewLinear: { width: '80%' },
  previewBold: { transform: [{ scale: 0.5 }] },
  previewFlip: { transform: [{ scale: 0.5 }] },
  previewDot: { transform: [{ scale: 0.3 }] },
});
