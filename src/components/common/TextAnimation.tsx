import React, { useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Pressable, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withRepeat, withTiming } from 'react-native-reanimated';

// ─── Shared Animated Character ───────────────────────────────────

function AnimatedChar({ char, index = 0, delay = 0, fontSize = 22, color = '#fff', isLive = false, trigger = 0,
}: {
    char: string;
    index?: number;
    delay?: number;
    fontSize?: number;
    color?: string;
    isLive?: boolean;
    trigger?: any;
}) {

    const progress = useSharedValue(0);
    const offset = useRef({
        x: (Math.random() - 0.5) * (isLive ? 250 : 300),
        y: (Math.random() - 0.5) * (isLive ? 400 : 500),
        r: (Math.random() - 0.5) * (isLive ? 90 : 120),
    }).current;

    useEffect(() => {
        progress.value = 0;
        progress.value = withDelay(
            isLive ? 0 : index * delay,
            withSpring(1, { damping: 14, stiffness: 120, mass: 0.5 })
        );
    }, [trigger, isLive, index, delay]);

    const animatedStyle = useAnimatedStyle(() => {
        const p = progress.value;
        const inv = 1 - p;
        return {
            opacity: p,
            transform: [
                { translateX: inv * offset.x },
                { translateY: inv * offset.y },
                { rotate: `${inv * offset.r}deg` },
                { scale: (isLive ? 0.4 : 0.5) + p * (isLive ? 0.6 : 0.5) },
            ],
        };
    });

    if (char === ' ') return <View style={{ width: fontSize * 0.3 }} />;

    return (
        <Animated.View style={animatedStyle}>
            <Text style={[styles.char, { fontSize, color, lineHeight: fontSize * 1.4 }]}>
                {char}
            </Text>
        </Animated.View>
    );
}

// ─── FlyingTextInput (Interactive) ────────────────────────────────

export function FlyingTextInput({ value: propValue, onChangeText, fontSize = 24, color = '#fff', placeholder = 'Start typing…' }: { value?: string; onChangeText?: (t: string) => void; fontSize?: number; color?: string; placeholder?: string }) {

    const [internalValue, setInternalValue] = useState('');
    const val = propValue ?? internalValue;
    const inputRef = useRef<TextInput>(null);
    const [charKeys, setCharKeys] = useState<number[]>([]);
    const nextKey = useRef(0);
    const cursorOpacity = useSharedValue(1);

    useEffect(() => {
        cursorOpacity.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
    }, []);

    useEffect(() => {
        setCharKeys(prev => {
            if (val.length > prev.length) {
                return [...prev, ...Array(val.length - prev.length).fill(0).map(() => nextKey.current++)];
            }
            return prev.slice(0, val.length);
        });
    }, [val]);

    const cursorStyle = useAnimatedStyle(() => ({ opacity: cursorOpacity.value }));

    return (
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>Focus Goal</Text>
            <Pressable style={styles.inputBox} onPress={() => inputRef.current?.focus()}>
                {!val && <Text style={[styles.placeholder, { fontSize: fontSize * 0.8 }]}>{placeholder}</Text>}
                <View style={styles.charContainer}>
                    {val.split('').map((c, i) => (
                        <AnimatedChar key={charKeys[i] ?? i} char={c} fontSize={fontSize} color={color} isLive />
                    ))}
                    <Animated.View style={[styles.cursor, { height: fontSize * 1.2 }, cursorStyle]} />
                </View>
            </Pressable>
            <TextInput
                ref={inputRef}
                value={val}
                onChangeText={t => { propValue === undefined ? setInternalValue(t) : onChangeText?.(t); }}
                style={styles.hiddenInput}
                autoFocus autoCorrect={false} autoCapitalize="none"
            />
            <View style={styles.cardActions}>
                <Pressable onPress={() => setCharKeys(prev => prev.map(() => nextKey.current++))} style={styles.button}>
                    <Text style={styles.buttonText}>Replay</Text>
                </Pressable>
                {val.length > 0 && (
                    <Pressable onPress={() => { propValue === undefined ? setInternalValue('') : onChangeText?.(''); inputRef.current?.focus(); }} style={styles.clearButton}>
                        <Text style={styles.clearButtonText}>Clear</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { width: '100%', paddingVertical: 16, alignItems: 'center' },
    cardContainer: {
        width: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        borderRadius: 32,
        padding: 24,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
    },
    cardTitle: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 16,
        textAlign: 'center',
    },
    textBox: {
        width: '100%',
        minHeight: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
    },
    inputBox: {
        width: '100%',
        minHeight: 120,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 20,
        padding: 20,
        justifyContent: 'center',
    },
    charContainer: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' },
    char: { fontWeight: '700' },
    placeholder: { color: 'rgba(255, 255, 255, 0.2)', fontWeight: '500', position: 'absolute', left: 20 },
    cursor: { width: 2, backgroundColor: '#3b82f6', borderRadius: 2, marginLeft: 2 },
    hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
    cardActions: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 24 },
    button: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
    buttonText: { color: '#000', fontWeight: '800', fontSize: 12, textTransform: 'uppercase' },
    clearButton: { backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 12 },
    clearButtonText: { color: 'rgba(255, 255, 255, 0.6)', fontWeight: '700', fontSize: 12, textTransform: 'uppercase' },
});