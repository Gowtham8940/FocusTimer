import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  BounceIn,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FlipInEasyX,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import Sound from 'react-native-nitro-sound';
import ScreamForIceCreamChallenge from '../components/scream/ScreamForIceCreamChallenge';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');

const C = {
  bg: '#4BBDF5',
  bgDark: '#2EA8E8',
  cream: '#FFF8EE',
  chocolate: '#3D1C0A',
  red: '#E5282A',
  white: '#FFFFFF',
  spark: '#FFE566',
};

const IMG = {
  magnum: 'https://images.unsplash.com/photo-1629385701021-fcd85f2c0f9a?w=300&q=80',
  coneAmul: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=300&q=80',
  vanillaTub: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=300&q=80',
  chocoBrownie: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300&q=80',
  sandwich: 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=300&q=80',
  cassata: 'https://images.unsplash.com/photo-1557142046-c704a3adf364?w=300&q=80',
  magnumAlmond: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?w=300&q=80',
  triCone: 'https://images.unsplash.com/photo-1534790566855-4cb788d389ec?w=300&q=80',
};

const SPARKS = Array.from({length: 12}, (_, i) => ({
  id: i,
  x: Math.random() * SCREEN_W,
  y: Math.random() * (SCREEN_H * 0.6),
  size: 6 + Math.random() * 10,
  delay: Math.random() * 1500,
}));

const CHALLENGE_MS = 10000;
const DBFS_MIN = -60;
const DBFS_MAX = -5;

const normalizeDbfs = (dbfs: number) => {
  const n = (dbfs - DBFS_MIN) / (DBFS_MAX - DBFS_MIN);
  return Math.max(0, Math.min(1, n));
};

const Sparkle = ({x, y, size, delay}: (typeof SPARKS)[0]) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withSequence(withTiming(1, {duration: 600}), withTiming(0.2, {duration: 600})), -1, true),
    );
    translateY.value = withDelay(
      delay,
      withRepeat(withTiming(-14, {duration: 1200, easing: Easing.inOut(Easing.sin)}), -1, true),
    );
  }, [delay, opacity, translateY]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{translateY: translateY.value}],
  }));

  return (
    <Animated.Text style={[{position: 'absolute', left: x, top: y, fontSize: size, color: C.spark}, style]}>
      ✦
    </Animated.Text>
  );
};

const ScreamMeter = ({level}: {level: Animated.SharedValue<number>}) => {
  const barStyle = useAnimatedStyle(() => ({
    transform: [{scaleX: level.value}],
    backgroundColor: interpolateColor(level.value, [0, 0.5, 1], ['#FFD600', '#FF8800', '#E5282A']),
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(level.value, [0, 1], [0, 0.9]),
    shadowRadius: interpolate(level.value, [0, 1], [0, 20]),
  }));

  return (
    <View style={styles.meterWrap}>
      <Text style={styles.meterLabel}>🎙️ Scream louder!</Text>
      <View style={styles.meterTrack}>
        <Animated.View style={[styles.meterFill, barStyle, glowStyle, {originX: 0}]} />
      </View>
    </View>
  );
};

const IceCreamCard = ({
  label,
  badge,
  badgeColor,
  imgUri,
  delay,
}: {
  label: string;
  badge: string;
  badgeColor: string;
  imgUri: string;
  delay: number;
}) => (
  <Animated.View entering={FadeInDown.delay(delay).springify()} style={styles.card}>
    <View style={[styles.cardBadge, {backgroundColor: badgeColor}]}> 
      <Text style={styles.cardBadgeText}>{badge}</Text>
    </View>
    <Text style={styles.cardLabel}>{label}</Text>
    <Image source={{uri: imgUri}} style={styles.cardImg} resizeMode="cover" />
  </Animated.View>
);

const ScreamForIceCream = () => {
  const [showChallengeScreen, setShowChallengeScreen] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'listening' | 'unlocked'>('idle');
  const [countdown, setCountdown] = useState(10);
  const [maxScore, setMaxScore] = useState(0);
  const screamLevel = useSharedValue(0);

  const endAtRef = useRef(0);
  const peakRef = useRef(0);
  const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const iceBounce = useSharedValue(1);
  const iceRotate = useSharedValue(0);
  const btnScale = useSharedValue(1);
  const flashOpacity = useSharedValue(0);

  useEffect(() => {
    btnScale.value = withRepeat(withSequence(withTiming(1.06, {duration: 700}), withTiming(1, {duration: 700})), -1, true);
  }, [btnScale]);

  const stopListening = useCallback(async () => {
    if (tickerRef.current) {
      clearInterval(tickerRef.current);
      tickerRef.current = null;
    }
    try {
      Sound.removeRecordBackListener();
      await Sound.stopRecorder();
    } catch {}
  }, []);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  const requestMicPermission = useCallback(async () => {
    if (Platform.OS !== 'android') return true;
    const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
      title: 'Microphone Access',
      message: 'Need microphone access for scream challenge.',
      buttonPositive: 'Allow',
      buttonNegative: 'Cancel',
    });
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }, []);

  const triggerUnlock = useCallback(async () => {
    await stopListening();
    ReactNativeHapticFeedback.trigger('notificationSuccess');
    flashOpacity.value = withSequence(withTiming(1, {duration: 120}), withTiming(0, {duration: 400}));

    iceBounce.value = withSpring(1.4, {damping: 3}, () => {
      iceBounce.value = withSpring(1, {damping: 8});
    });
    iceRotate.value = withTiming(0, {duration: 300});
    screamLevel.value = withTiming(0, {duration: 600});

    runOnJS(setPhase)('unlocked');
  }, [flashOpacity, iceBounce, iceRotate, screamLevel, stopListening]);

  const startListening = useCallback(async () => {
    if (phase !== 'idle') return;

    const granted = await requestMicPermission();
    if (!granted) return;

    await stopListening();

    setPhase('listening');
    setCountdown(10);
    setMaxScore(0);
    peakRef.current = 0;
    endAtRef.current = Date.now() + CHALLENGE_MS;

    ReactNativeHapticFeedback.trigger('impactMedium');

    iceBounce.value = withRepeat(withSequence(withSpring(1.25, {damping: 4}), withSpring(1, {damping: 6})), -1, true);
    iceRotate.value = withRepeat(withSequence(withTiming(-8, {duration: 180}), withTiming(8, {duration: 180})), -1, true);

    try {
      Sound.setSubscriptionDuration(0.1);
      await Sound.startRecorder(undefined, undefined, true);

      Sound.addRecordBackListener(e => {
        const meter = typeof e.currentMetering === 'number' ? e.currentMetering : DBFS_MIN;
        const level = normalizeDbfs(meter);

        screamLevel.value = withTiming(level, {duration: 90});

        const score = Math.round(level * 100);
        if (score > peakRef.current) {
          peakRef.current = score;
          setMaxScore(score);
        }

        if (Date.now() >= endAtRef.current) {
          triggerUnlock();
        }
      });

      tickerRef.current = setInterval(() => {
        const left = Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000));
        setCountdown(left);
      }, 120);
    } catch {
      setPhase('idle');
      stopListening();
    }
  }, [iceBounce, iceRotate, phase, requestMicPermission, screamLevel, stopListening, triggerUnlock]);

  const reset = useCallback(async () => {
    await stopListening();
    screamLevel.value = withTiming(0, {duration: 300});
    iceBounce.value = withSpring(1);
    iceRotate.value = withTiming(0);
    setPhase('idle');
    setCountdown(10);
    setMaxScore(0);
  }, [iceBounce, iceRotate, screamLevel, stopListening]);

  const iceStyle = useAnimatedStyle(() => ({
    transform: [{scale: iceBounce.value}, {rotate: `${iceRotate.value}deg`}],
  }));

  const btnStyle = useAnimatedStyle(() => ({
    transform: [{scale: phase === 'idle' ? btnScale.value : 1}],
  }));

  const flashStyle = useAnimatedStyle(() => ({opacity: flashOpacity.value}));

  if (showChallengeScreen) {
    return <ScreamForIceCreamChallenge />;
  }

  return (
    <View style={styles.safe}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.nav}>
        {['All', 'Vacations', 'Electronics', 'Beauty', 'Decor', 'Kids'].map((tab, i) => (
          <TouchableOpacity key={tab} style={styles.navItem}>
            <Text style={styles.navIcon}>{['🛍️', '🏖️', '🎧', '💄', '🪑', '🍼'][i]}</Text>
            <Text style={[styles.navLabel, i === 0 && {color: C.white, fontWeight: '700'}]}>{tab}</Text>
            {i === 0 && <View style={styles.navUnderline} />}
          </TouchableOpacity>
        ))}
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[C.bg, C.bgDark]} style={styles.hero}>
          {SPARKS.map(s => (
            <Sparkle key={s.id} {...s} />
          ))}

          <Animated.View entering={ZoomIn.delay(100).springify()} style={styles.ticket}>
            <View style={styles.ticketTearLeft} />
            <View style={styles.ticketBody}>
              <Text style={styles.ticketScream}>sCReAM</Text>
              <Text style={styles.ticketFor}>FOR</Text>
              <Text style={styles.ticketIce}>ICE-CREAM</Text>
            </View>
            <View style={styles.ticketTearRight} />
          </Animated.View>

          <Animated.View style={[styles.iceCreamWrap, iceStyle]}>
            <Image source={{uri: IMG.magnum}} style={styles.iceCreamImg} resizeMode="contain" />
          </Animated.View>

          {phase === 'listening' && (
            <Animated.View entering={FadeIn} style={styles.meterContainer}>
              <ScreamMeter level={screamLevel} />
              <Text style={styles.countdownText}>{countdown > 0 ? `${countdown}s` : 'Analyzing...'}</Text>
              <Text style={styles.maxScoreText}>Max scream score: {maxScore}</Text>
            </Animated.View>
          )}

          {phase === 'idle' && (
            <Animated.View style={btnStyle}>
              <TouchableOpacity
                style={styles.playBtn}
                activeOpacity={0.85}
                onPress={() => setShowChallengeScreen(true)}>
                <Text style={styles.playBtnText}>Play Now</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {phase === 'listening' && (
            <Animated.View entering={BounceIn}>
              <TouchableOpacity style={[styles.playBtn, {backgroundColor: C.red}]} onPress={reset}>
                <Text style={styles.playBtnText}>🎙️ Screaming... Stop</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          {phase === 'unlocked' && (
            <Animated.View entering={FlipInEasyX.springify()}>
              <LinearGradient colors={['#FFD600', '#FF8800']} style={[styles.playBtn, styles.unlockedBtn]}>
                <Text style={[styles.playBtnText, {color: C.chocolate}]}>🎉 Discount Unlocked!</Text>
              </LinearGradient>
              <Text style={styles.maxScoreUnlocked}>Your max scream score: {maxScore}</Text>
              <TouchableOpacity onPress={reset} style={styles.playAgainWrap}>
                <Text style={styles.playAgainText}>Play again</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </LinearGradient>

        <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFillObject, styles.flash, flashStyle]} />

        <Animated.View entering={FadeInUp.delay(300).springify()} style={styles.maniaRow}>
          <Text style={styles.maniaSparkle}>✦</Text>
          <Text style={styles.maniaTitle}> ICE CREAM WEEKEND MANIA </Text>
          <Text style={styles.maniaSparkle}>✦</Text>
        </Animated.View>

        <View style={styles.cardsRow}>
          <IceCreamCard label="Cones & Sticks" badge="Starting at ₹29" badgeColor={C.chocolate} imgUri={IMG.coneAmul} delay={400} />
          <IceCreamCard label="Tubs & Cakes" badge="Up to 25% OFF" badgeColor={C.red} imgUri={IMG.vanillaTub} delay={500} />
          <IceCreamCard
            label="Cups, Cassata & Sandwich"
            badge="Starting at ₹39"
            badgeColor={C.chocolate}
            imgUri={IMG.cassata}
            delay={600}
          />
        </View>

        <Animated.View entering={FadeInUp.delay(700).springify()} style={styles.section}>
          <Text style={styles.sectionTitle}>🍦 Top Picks for You</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              {name: 'Magnum Almond', price: '₹75', img: IMG.magnumAlmond},
              {name: 'Amul Tri-Cone', price: '₹29', img: IMG.triCone},
              {name: 'Choco Brownie', price: '₹89', img: IMG.chocoBrownie},
              {name: 'Sandwich Gold', price: '₹39', img: IMG.sandwich},
            ].map((p, i) => (
              <Animated.View key={p.name} entering={ZoomIn.delay(700 + i * 80).springify()} style={styles.featCard}>
                <Image source={{uri: p.img}} style={styles.featImg} resizeMode="cover" />
                <Text style={styles.featName}>{p.name}</Text>
                <View style={styles.featFooter}>
                  <Text style={styles.featPrice}>{p.price}</Text>
                  <TouchableOpacity style={styles.addBtn}>
                    <Text style={styles.addBtnText}>+ Add</Text>
                  </TouchableOpacity>
                </View>
              </Animated.View>
            ))}
          </ScrollView>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safe: {backgroundColor: C.bg, borderRadius: 16, overflow: 'hidden', width: '100%'},
  scrollContent: {paddingBottom: 40},
  nav: {
    flexDirection: 'row',
    backgroundColor: C.bg,
    width: '100%',
    paddingHorizontal: 4,
    paddingTop: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  navItem: {alignItems: 'center', flex: 1, paddingVertical: 4},
  navIcon: {fontSize: 20},
  navLabel: {fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 2},
  navUnderline: {height: 2, width: '80%', backgroundColor: C.white, borderRadius: 2, marginTop: 3},
  hero: {
    minHeight: SCREEN_H * 0.4,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  ticket: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.25)',
  },
  ticketTearLeft: {
    width: 16,
    height: 80,
    backgroundColor: C.cream,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  ticketBody: {backgroundColor: C.cream, paddingHorizontal: 20, paddingVertical: 12, alignItems: 'flex-start'},
  ticketTearRight: {
    width: 12,
    height: 80,
    backgroundColor: C.cream,
    borderStyle: 'dashed',
    borderLeftWidth: 2,
    borderLeftColor: 'rgba(0,0,0,0.12)',
  },
  ticketScream: {fontSize: 32, fontWeight: '900', color: C.chocolate, letterSpacing: 1, fontStyle: 'italic'},
  ticketFor: {fontSize: 13, fontWeight: '700', color: C.chocolate, letterSpacing: 4},
  ticketIce: {fontSize: 26, fontWeight: '900', color: C.red, letterSpacing: 1},
  iceCreamWrap: {marginBottom: 12, marginTop: -10, zIndex: 10},
  iceCreamImg: {width: 90, height: 130, borderRadius: 8},
  meterContainer: {width: SCREEN_W - 64, marginBottom: 12, alignItems: 'center'},
  meterWrap: {width: '100%'},
  meterLabel: {color: C.white, fontSize: 13, fontWeight: '600', marginBottom: 6, textAlign: 'center'},
  meterTrack: {height: 16, backgroundColor: 'rgba(255,255,255,0.25)', borderRadius: 8, overflow: 'hidden'},
  meterFill: {height: '100%', width: '100%', borderRadius: 8},
  countdownText: {marginTop: 8, fontSize: 22, fontWeight: '800', color: C.white, letterSpacing: 2},
  maxScoreText: {marginTop: 6, color: C.white, fontSize: 13, fontWeight: '700'},
  playBtn: {
    backgroundColor: C.chocolate,
    borderRadius: 28,
    paddingHorizontal: 44,
    paddingVertical: 14,
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
  },
  unlockedBtn: {paddingHorizontal: 32},
  playBtnText: {color: C.white, fontSize: 17, fontWeight: '800', letterSpacing: 0.5},
  maxScoreUnlocked: {marginTop: 10, color: C.white, fontSize: 13, textAlign: 'center'},
  playAgainWrap: {marginTop: 10, alignSelf: 'center'},
  playAgainText: {color: C.white, opacity: 0.8, fontSize: 12},
  flash: {backgroundColor: C.white, zIndex: 999},
  maniaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.bg,
    paddingVertical: 14,
  },
  maniaSparkle: {fontSize: 18, color: C.spark},
  maniaTitle: {fontSize: 16, fontWeight: '900', color: C.white, letterSpacing: 1},
  cardsRow: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
    backgroundColor: C.bg,
    paddingBottom: 20,
  },
  card: {
    width: '31%',
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 10,
    overflow: 'hidden',
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
  },
  cardBadge: {borderRadius: 4, paddingHorizontal: 6, paddingVertical: 3, alignSelf: 'flex-start', marginBottom: 6},
  cardBadgeText: {color: C.white, fontSize: 9, fontWeight: '700'},
  cardLabel: {fontSize: 12, fontWeight: '700', color: C.chocolate, marginBottom: 8, lineHeight: 16},
  cardImg: {width: '100%', height: 80, borderRadius: 8},
  section: {backgroundColor: '#E8F5FD', paddingTop: 20, paddingBottom: 10},
  sectionTitle: {fontSize: 18, fontWeight: '800', color: C.chocolate, marginLeft: 16, marginBottom: 14},
  featCard: {
    width: 140,
    backgroundColor: C.white,
    borderRadius: 14,
    marginLeft: 12,
    padding: 10,
    boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.08)',
  },
  featImg: {width: '100%', height: 90, borderRadius: 10, marginBottom: 8},
  featName: {fontSize: 12, fontWeight: '600', color: C.chocolate, marginBottom: 8},
  featFooter: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  featPrice: {fontSize: 14, fontWeight: '800', color: C.chocolate},
  addBtn: {backgroundColor: C.bg, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4},
  addBtnText: {color: C.white, fontSize: 12, fontWeight: '700'},
});

export default ScreamForIceCream;
