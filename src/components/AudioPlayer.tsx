import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from './theme';

interface AudioPlayerProps {
    audioUrl: string;
    autoPlay?: boolean;
}

function formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
}

export function AudioPlayer({ audioUrl, autoPlay = false }: AudioPlayerProps) {
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
    }, [isSeeking]);

    useEffect(() => {
        let sound: Audio.Sound;
        (async () => {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound: s } = await Audio.Sound.createAsync(
                { uri: audioUrl },
                { shouldPlay: autoPlay },
                onPlaybackStatusUpdate,
            );
            sound = s;
            soundRef.current = s;
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
        <View style={styles.container}>
            <TouchableOpacity onPress={togglePlay} style={styles.playBtn} disabled={isLoading}>
                <MaterialIcons
                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                    size={48}
                    color={Colors.primary}
                />
            </TouchableOpacity>
            <View style={styles.right}>
                <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={durationMs || 1}
                    value={positionMs}
                    minimumTrackTintColor={Colors.primary}
                    maximumTrackTintColor={Colors.surface ?? '#1e3d39'}
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
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.backgroundCard ?? '#1a3330',
        borderRadius: Radii.lg,
        padding: Spacing.md,
        gap: Spacing.sm,
    },
    playBtn: {
        marginRight: Spacing.xs,
    },
    right: {
        flex: 1,
    },
    slider: {
        width: '100%',
        height: 36,
    },
    timeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: -6,
        paddingHorizontal: 4,
    },
    time: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
});
