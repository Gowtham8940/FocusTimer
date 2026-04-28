import React from 'react';
import { Pressable, StyleSheet, View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../theme/theme';

export function CustomAppHeader({ navigation }: any) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.customHeader, { paddingTop: insets.top }]}>
      {/* Left: Profile / Drawer Toggle */}
      <Pressable onPress={() => navigation.toggleDrawer()} style={styles.headerProfile}>
        <View style={styles.headerAvatar}>
          <Text style={styles.headerAvatarText}>JD</Text>
        </View>
      </Pressable>

      {/* Center: App Name */}
      <View style={styles.headerTitleContainer}>
        <Text style={styles.headerTitle}>FocusTimer</Text>
      </View>

      {/* Right: Two icons */}
      <View style={styles.headerRight}>
        <Pressable style={styles.headerIcon}>
          <Icon name="search-outline" size={22} color={theme.colors.text} />
        </Pressable>
        <Pressable style={styles.headerIcon}>
          <Icon name="notifications-outline" size={22} color={theme.colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerProfile: {
    padding: 4,
  },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    borderWidth: 1.5,
    borderColor: 'rgba(79, 163, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatarText: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIcon: {
    padding: 4,
  },
});
