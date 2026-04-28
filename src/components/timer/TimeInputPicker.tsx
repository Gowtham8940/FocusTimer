import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../../theme/theme';

interface TimeInputPickerProps {
  hours: number;
  minutes: number;
  seconds: number;
  onChange: (h: number, m: number, s: number) => void;
}

export function TimeInputPicker({ hours, minutes, seconds, onChange }: TimeInputPickerProps) {
  const updateValue = (type: 'h' | 'm' | 's', val: number) => {
    let h = hours;
    let m = minutes;
    let s = seconds;
    
    if (type === 'h') h = Math.max(0, Math.min(99, val));
    // allow rollover for minutes/seconds if going below 0 or above 59
    if (type === 'm') {
        if (val > 59) m = 0;
        else if (val < 0) m = 59;
        else m = val;
    }
    if (type === 's') {
        if (val > 59) s = 0;
        else if (val < 0) s = 59;
        else s = val;
    }
    
    onChange(h, m, s);
  };

  const InputColumn = ({ label, value, type }: { label: string, value: number, type: 'h'|'m'|'s' }) => {
    const [localValue, setLocalValue] = React.useState(value.toString().padStart(2, '0'));
    const [isFocused, setIsFocused] = React.useState(false);

    React.useEffect(() => {
      if (!isFocused) {
        setLocalValue(value.toString().padStart(2, '0'));
      }
    }, [value, isFocused]);

    return (
      <View style={styles.column}>
        <Pressable onPress={() => updateValue(type, value + 1)} style={styles.chevron}>
          <Icon name="chevron-up" size={28} color={theme.colors.mutedText} />
        </Pressable>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={localValue}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(txt) => {
            const raw = txt.replace(/[^0-9]/g, '');
            const limited = raw.slice(-2);
            setLocalValue(limited);
            const num = parseInt(limited || '0', 10);
            updateValue(type, num);
          }}
        />
        <Pressable onPress={() => updateValue(type, value - 1)} style={styles.chevron}>
          <Icon name="chevron-down" size={28} color={theme.colors.mutedText} />
        </Pressable>
        <Text style={styles.label}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <InputColumn label="hours" value={hours} type="h" />
      <Text style={styles.colon}>:</Text>
      <InputColumn label="min" value={minutes} type="m" />
      <Text style={styles.colon}>:</Text>
      <InputColumn label="sec" value={seconds} type="s" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    alignItems: 'center',
    width: 90,
  },
  chevron: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  input: {
    fontSize: 54,
    fontWeight: '700',
    color: theme.colors.text,
    fontFamily: 'Courier',
    textAlign: 'center',
    padding: 0,
    margin: 0,
    width: '100%',
  },
  label: {
    color: theme.colors.mutedText,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colon: {
    fontSize: 54,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.2)',
    fontFamily: 'Courier',
    marginBottom: 26, 
    marginHorizontal: 4,
  },
});
