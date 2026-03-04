import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Radii, Typography } from './theme';

interface TopicRowProps {
    title: string;
    duration?: string;
    icon?: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    onPlayPress: () => void;
    isPlaying?: boolean;
}

export function TopicRow({
    title,
    duration = 'Audio Guide',
    icon = 'medical-information',
    onPress,
    onPlayPress,
    isPlaying
}: TopicRowProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.iconContainer}>
                <MaterialIcons name={icon as any} size={24} color={Colors.primary} />
            </View>
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                <Text style={styles.meta}>{duration} • Audio Guide</Text>
            </View>
            <TouchableOpacity
                style={[styles.playButton, isPlaying && styles.playButtonActive]}
                onPress={onPlayPress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
                <MaterialIcons
                    name={isPlaying ? 'pause-circle-filled' : 'play-circle-filled'}
                    size={32}
                    color={isPlaying ? Colors.background : Colors.primary}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(43, 238, 222, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(43, 238, 222, 0.2)',
        borderRadius: Radii.xl,
        padding: Spacing.md,
        marginBottom: Spacing.base,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 8,
        backgroundColor: 'rgba(43, 238, 222, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        ...Typography.bodyMedium,
        fontFamily: 'Lexend_700Bold',
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    meta: {
        ...Typography.bodySmall,
        color: 'rgba(43, 238, 222, 0.6)',
        fontWeight: '500',
    },
    playButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(43, 238, 222, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: Spacing.sm,
    },
    playButtonActive: {
        backgroundColor: Colors.primary,
    },
});
