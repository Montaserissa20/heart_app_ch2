import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from './theme';

interface CategoryCardProps {
    title: string;
    onPress: () => void;
    onPlayPress: () => void;
    isPlaying?: boolean;
}

export function CategoryCard({ title, onPress, onPlayPress, isPlaying }: CategoryCardProps) {
    return (
        <TouchableOpacity
            style={styles.card}
            onPress={onPress}
            activeOpacity={0.85}
        >
            <Text style={styles.title} numberOfLines={1}>{title}</Text>
            <TouchableOpacity
                style={styles.playButton}
                onPress={onPlayPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <MaterialIcons
                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                    size={36}
                    color={Colors.background}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        borderRadius: Radii.xl,
        height: 80,
        paddingHorizontal: Spacing.lg,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    title: {
        ...Typography.titleMedium,
        color: Colors.background,
        flex: 1,
        marginRight: Spacing.sm,
    },
    playButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 22,
        borderWidth: 2,
        borderColor: 'rgba(16,34,32,0.2)',
    },
});
