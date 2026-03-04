import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Radii } from './theme';
import { useEffect, useRef } from 'react';

function SkeletonCard() {
    const anim = useRef(new Animated.Value(0.4)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(anim, { toValue: 1, duration: 800, useNativeDriver: true }),
                Animated.timing(anim, { toValue: 0.4, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.skeletonCard, { opacity: anim }]} />
    );
}

export function LoadingState() {
    return (
        <View style={styles.container}>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: Spacing.base,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.base,
    },
    skeletonCard: {
        height: 80,
        borderRadius: Radii.xl,
        backgroundColor: Colors.surface ?? '#1e3d39',
    },
});
