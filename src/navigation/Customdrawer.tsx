import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    Image,
    ScrollView,
    Platform,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerContentComponentProps,
} from '@react-navigation/drawer';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    withDelay,
    interpolate,
    interpolateColor,
    Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import { theme } from '../theme/theme';

// ─── App version / meta ───────────────────────────────────────────────────────
const APP_VERSION = '1.0.0';
const BUILD_NUMBER = '42';
const COPYRIGHT_YEAR = new Date().getFullYear();

// ─── Route → icon map ─────────────────────────────────────────────────────────
const ROUTE_META: Record<string, { icon: string; label: string; color: string }> = {
    HomeTabs: { icon: 'timer', label: 'Focus Timer', color: '#4fa3ff' },
    Notes: { icon: 'document-text', label: 'Notes', color: '#54d4a0' },
    Reports: { icon: 'bar-chart', label: 'Reports', color: '#f5a623' },
    CategoryManager: { icon: 'grid', label: 'Categories', color: '#c77dff' },
    TimerTemplates: { icon: 'color-palette', label: 'Templates', color: '#ff6b6b' },
    Settings: { icon: 'settings', label: 'Settings', color: '#78909c' },
};

// ─── Single animated drawer item ──────────────────────────────────────────────
function DrawerItem({
    icon,
    label,
    color,
    isActive,
    onPress,
    index,
    drawerOpen,
}: {
    icon: string;
    label: string;
    color: string;
    isActive: boolean;
    onPress: () => void;
    index: number;
    drawerOpen: boolean;
}) {
    const mounted = useSharedValue(0);
    const active = useSharedValue(isActive ? 1 : 0);
    const pressed = useSharedValue(0);

    // Staggered entrance
    useEffect(() => {
        if (drawerOpen) {
            mounted.value = withDelay(
                index * 60,
                withSpring(1, { damping: 16, stiffness: 140 }),
            );
        } else {
            mounted.value = withTiming(0, { duration: 100 });
        }
    }, [drawerOpen]);

    useEffect(() => {
        active.value = isActive
            ? withSpring(1, { damping: 14, stiffness: 160 })
            : withTiming(0, { duration: 220 });
    }, [isActive]);

    const rowStyle = useAnimatedStyle(() => ({
        opacity: interpolate(mounted.value, [0, 1], [0, 1]),
        transform: [
            { translateX: interpolate(mounted.value, [0, 1], [-28, 0]) },
            { scale: interpolate(pressed.value, [0, 1], [1, 0.97]) },
        ],
    }));

    const pillStyle = useAnimatedStyle(() => ({
        opacity: interpolate(active.value, [0, 1], [0, 1]),
        scaleX: interpolate(active.value, [0, 1], [0.5, 1]),
    }));

    const iconBgStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            active.value,
            [0, 1],
            ['rgba(255,255,255,0.04)', `${color}22`],
        ) as string,
        borderColor: interpolateColor(
            active.value,
            [0, 1],
            ['rgba(255,255,255,0.06)', `${color}55`],
        ) as string,
    }));

    const labelStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            active.value,
            [0, 1],
            [theme.colors.mutedText, theme.colors.text],
        ) as string,
    }));

    return (
        <Animated.View style={rowStyle}>
            <Pressable
                onPress={onPress}
                onPressIn={() => { pressed.value = withTiming(1, { duration: 80 }); }}
                onPressOut={() => { pressed.value = withSpring(0); }}
                style={styles.itemPressable}
            >
                {/* Active bg pill */}
                <Animated.View style={[styles.itemPill, pillStyle]} />

                {/* Icon badge */}
                <Animated.View style={[styles.iconBadge, iconBgStyle]}>
                    <Icon
                        name={isActive ? icon : `${icon}-outline`}
                        size={18}
                        color={isActive ? color : theme.colors.mutedText}
                    />
                </Animated.View>

                {/* Label */}
                <Animated.Text style={[styles.itemLabel, labelStyle]}>
                    {label}
                </Animated.Text>

                {/* Active dot */}
                {isActive && (
                    <View style={[styles.activeDot, { backgroundColor: color }]} />
                )}
            </Pressable>
        </Animated.View>
    );
}

// ─── Profile header ───────────────────────────────────────────────────────────
function DrawerProfile({ drawerOpen }: { drawerOpen: boolean }) {
    const mount = useSharedValue(0);

    useEffect(() => {
        mount.value = drawerOpen
            ? withDelay(40, withSpring(1, { damping: 14, stiffness: 120 }))
            : withTiming(0, { duration: 100 });
    }, [drawerOpen]);

    const containerStyle = useAnimatedStyle(() => ({
        opacity: interpolate(mount.value, [0, 1], [0, 1]),
        transform: [{ translateY: interpolate(mount.value, [0, 1], [-12, 0]) }],
    }));

    const avatarRingStyle = useAnimatedStyle(() => ({
        transform: [{ scale: interpolate(mount.value, [0, 1], [0.8, 1]) }],
        opacity: mount.value,
    }));

    return (
        <Animated.View style={[styles.profileContainer, containerStyle]}>
            {/* Avatar with ring */}
            <Animated.View style={[styles.avatarRing, avatarRingStyle]}>
                <View style={styles.avatarInner}>
                    {/* Placeholder initials — replace with <Image> when you have a URI */}
                    <Text style={styles.avatarInitials}>JD</Text>
                </View>
            </Animated.View>

            <View style={styles.profileText}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileSub}>john@focusapp.io</Text>
            </View>

            {/* Accent line */}
            <View style={styles.profileDivider} />
        </Animated.View>
    );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function DrawerFooter({ drawerOpen }: { drawerOpen: boolean }) {
    const mount = useSharedValue(0);

    useEffect(() => {
        mount.value = drawerOpen
            ? withDelay(360, withTiming(1, { duration: 400 }))
            : withTiming(0, { duration: 80 });
    }, [drawerOpen]);

    const style = useAnimatedStyle(() => ({
        opacity: mount.value,
        transform: [{ translateY: interpolate(mount.value, [0, 1], [10, 0]) }],
    }));

    return (
        <Animated.View style={[styles.footer, style]}>
            <View style={styles.footerDivider} />

            <View style={styles.footerRow}>
                <Icon name="information-circle-outline" size={13} color="#2e4560" />
                <Text style={styles.footerVersion}>
                    {' '}Version {APP_VERSION} ({BUILD_NUMBER})
                </Text>
            </View>

            <Text style={styles.footerCopy}>
                © {COPYRIGHT_YEAR} FocusApp. All rights reserved.
            </Text>

            <View style={styles.footerLinks}>
                <Text style={styles.footerLink}>Privacy Policy</Text>
                <Text style={styles.footerSep}>·</Text>
                <Text style={styles.footerLink}>Terms of Use</Text>
                <Text style={styles.footerSep}>·</Text>
                <Text style={styles.footerLink}>Licenses</Text>
            </View>

            <Text style={styles.footerPlatform}>
                {Platform.OS === 'ios' ? '🍎 iOS' : '🤖 Android'} · React Native
            </Text>
        </Animated.View>
    );
}

// ─── Separator ────────────────────────────────────────────────────────────────
function DrawerSeparator({ label }: { label: string }) {
    return (
        <View style={styles.separator}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorLabel}>{label}</Text>
        </View>
    );
}

// ─── Main Custom Drawer ───────────────────────────────────────────────────────
export function CustomDrawerContent(props: DrawerContentComponentProps) {
    const { state, navigation } = props;
    const drawerOpen = true; // always true once mounted; driven by re-mount on open

    const primaryRoutes = ['HomeTabs', 'Notes', 'Reports'];
    const secondaryRoutes = ['CategoryManager', 'TimerTemplates', 'Settings'];

    const activeRouteName = state.routes[state.index]?.name;

    const renderItem = (routeName: string, idx: number) => {
        const meta = ROUTE_META[routeName];
        if (!meta) return null;
        const isActive = activeRouteName === routeName;
        return (
            <DrawerItem
                key={routeName}
                icon={meta.icon}
                label={meta.label}
                color={meta.color}
                isActive={isActive}
                onPress={() => navigation.navigate(routeName)}
                index={idx}
                drawerOpen={drawerOpen}
            />
        );
    };

    return (
        <View style={styles.drawerRoot}>
            {/* Decorative background blobs */}
            <View style={styles.blobTop} />
            <View style={styles.blobBottom} />

            <DrawerContentScrollView
                {...props}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Profile */}
                <DrawerProfile drawerOpen={drawerOpen} />

                {/* Primary nav */}
                <View style={styles.section}>
                    {primaryRoutes.map((r, i) => renderItem(r, i))}
                </View>

                <DrawerSeparator label="TOOLS" />

                {/* Secondary nav */}
                <View style={styles.section}>
                    {secondaryRoutes.map((r, i) => renderItem(r, primaryRoutes.length + i))}
                </View>
            </DrawerContentScrollView>

            {/* Footer pinned at bottom */}
            <DrawerFooter drawerOpen={drawerOpen} />
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    drawerRoot: {
        flex: 1,
        backgroundColor: theme.colors.surface,
    },

    // Decorative background
    blobTop: {
        position: 'absolute',
        top: -60,
        left: -60,
        width: 220,
        height: 220,
        borderRadius: 110,
        backgroundColor: 'rgba(30, 80, 160, 0.12)',
    },
    blobBottom: {
        position: 'absolute',
        bottom: 60,
        right: -80,
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(80, 20, 120, 0.08)',
    },

    scrollContent: {
        paddingBottom: 8,
    },

    // ── Profile ──
    profileContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 8,
    },
    avatarRing: {
        width: 64,
        height: 64,
        borderRadius: 32,
        padding: 2.5,
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: 'rgba(79, 163, 255, 0.45)',
        marginBottom: 12,
        // Soft glow
        shadowColor: '#4fa3ff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    avatarInner: {
        flex: 1,
        borderRadius: 28,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarInitials: {
        color: theme.colors.text,
        fontSize: 20,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    profileText: {
        gap: 2,
    },
    profileName: {
        color: theme.colors.text,
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    profileSub: {
        color: theme.colors.mutedText,
        fontSize: 12,
        letterSpacing: 0.1,
    },
    profileDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginTop: 18,
    },

    // ── Section ──
    section: {
        paddingHorizontal: 12,
        paddingTop: 4,
        gap: 2,
    },

    // ── Item ──
    itemPressable: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 48,
        paddingHorizontal: 10,
        borderRadius: 14,
        gap: 12,
        overflow: 'hidden',
    },
    itemPill: {
        position: 'absolute',
        inset: 0,
        borderRadius: 14,
        backgroundColor: 'rgba(30, 70, 130, 0.35)',
        borderWidth: 1,
        borderColor: 'rgba(79, 163, 255, 0.12)',
    },
    iconBadge: {
        width: 34,
        height: 34,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    itemLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.15,
    },
    activeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 4,
    },

    // ── Separator ──
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.border,
    },
    separatorLabel: {
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1.2,
        color: theme.colors.mutedText,
    },

    // ── Footer ──
    footer: {
        paddingHorizontal: 20,
        paddingBottom: Platform.OS === 'ios' ? 32 : 20,
        gap: 4,
    },
    footerDivider: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginBottom: 10,
    },
    footerRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerVersion: {
        fontSize: 11,
        color: theme.colors.mutedText,
        fontWeight: '500',
    },
    footerCopy: {
        fontSize: 10,
        color: theme.colors.mutedText,
        marginTop: 2,
    },
    footerLinks: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginTop: 6,
    },
    footerLink: {
        fontSize: 10,
        color: theme.colors.mutedText,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    footerSep: {
        fontSize: 10,
        color: theme.colors.mutedText,
    },
    footerPlatform: {
        fontSize: 10,
        color: theme.colors.mutedText,
        marginTop: 4,
    },
});