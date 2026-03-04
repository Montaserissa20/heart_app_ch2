import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from './theme';

interface TopicAudioPlayerProps {
    audioUrl: string;
    title: string;
    narrator?: string;
    imageUrl?: string;
}

function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function TopicAudioPlayer({
    audioUrl,
    title,
    narrator = 'Audio Narrator',
    imageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWFlTHC99B045txeF_-T9qt9rqEzc2uwEkxYnn9HCMWVtfZtu2DaPydo1vMC6P7KhEGSpbAYWBztnLMn2rsUKDqKfvSfVhQv4GoBbDtG6T1nb6va2lS3V-WUlV8ki_sD-s8xmoclBu3BWteqGN5vcEY_tkcLOmepQg9oqtmchXjuyAXa05h0ur1ozXiIJVxUpaaL5cp_xnmGHpEd9iWdp8eaPsgHBgEXizOeYLjh9Mqnia_H1YLkJCrHx4-bKliA8awzaDDqfW2KhS'
}: TopicAudioPlayerProps) {
    const soundRef = useRef<Audio.Sound | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [positionMs, setPositionMs] = useState(0);
    const [durationMs, setDurationMs] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);

    const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (!isSeeking) setPositionMs(status.positionMillis);
        if (status.durationMillis) setDurationMs(status.durationMillis);
        setIsPlaying(status.isPlaying);
        setIsLoading(false);
        if (status.didJustFinish) {
            setIsPlaying(false);
            setPositionMs(0);
            soundRef.current?.setPositionAsync(0);
        }
    }, [isSeeking]);

    useEffect(() => {
        let sound: Audio.Sound;
        (async () => {
            try {
                await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
                const { sound: s } = await Audio.Sound.createAsync(
                    { uri: audioUrl },
                    { shouldPlay: false },
                    onPlaybackStatusUpdate,
                );
                sound = s;
                soundRef.current = s;
            } catch (error) {
                console.error('Error loading audio:', error);
            }
        })();
        return () => {
            sound?.unloadAsync();
        };
    }, [audioUrl]);

    const togglePlay = async () => {
        if (!soundRef.current) return;
        if (isPlaying) {
            await soundRef.current.pauseAsync();
        } else {
            await soundRef.current.playAsync();
        }
    };

    const onSlidingStart = () => setIsSeeking(true);
    const onSlidingComplete = async (val: number) => {
        setIsSeeking(false);
        if (!soundRef.current) return;
        await soundRef.current.setPositionAsync(val);
        setPositionMs(val);
    };

    return (
        <View style={styles.card}>
            <View style={styles.topRow}>
                <Image source={{ uri: imageUrl }} style={styles.image} />
                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                    <Text style={styles.narrator} numberOfLines={1}>Audio Narrator: {narrator}</Text>
                </View>
                <TouchableOpacity onPress={togglePlay} style={styles.playBtn} disabled={isLoading}>
                    <MaterialIcons
                        name={isPlaying ? 'pause' : 'play-arrow'}
                        size={32}
                        color={Colors.background}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.bottomRow}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={durationMs || 1}
                    value={positionMs}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor="rgba(43, 238, 222, 0.2)"
                    thumbTintColor={Colors.primary}
                    onSlidingStart={onSlidingStart}
                    onSlidingComplete={onSlidingComplete}
                    disabled={isLoading}
                />
                <View style={styles.timeRow}>
                    <Text style={styles.time}>{formatTime(positionMs)}</Text>
                    <Text style={styles.time}>{formatTime(durationMs)}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'rgba(43, 238, 222, 0.08)',
        borderRadius: Radii.xl,
        borderWidth: 1,
        borderColor: 'rgba(43, 238, 222, 0.2)',
        padding: Spacing.md,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: Radii.md,
        backgroundColor: 'rgba(0,0,0,0.1)',
    },
    info: {
        flex: 1,
    },
    title: {
        ...Typography.bodyMedium,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    narrator: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    playBtn: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    bottomRow: {
        marginTop: Spacing.sm,
    },
    slider: {
        width: '100%',
        height: 30,
        marginHorizontal: -10, // Adjust for slider default padding
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -4,
    },
    time: {
        fontSize: 12,
        fontFamily: 'Lexend_500Medium',
        color: Colors.textSecondary,
    },
});
