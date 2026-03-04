import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from './theme';

interface ErrorStateProps {
    message?: string;
    onRetry?: () => void;
}

export function ErrorState({ message = 'Something went wrong.', onRetry }: ErrorStateProps) {
    return (
        <View style={styles.container}>
            <MaterialIcons name="error-outline" size={56} color={Colors.error ?? '#f87171'} />
            <Text style={styles.message}>{message}</Text>
            {onRetry && (
                <TouchableOpacity style={styles.retryBtn} onPress={onRetry}>
                    <Text style={styles.retryText}>Try Again</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.base,
        paddingHorizontal: Spacing.xl,
    },
    message: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: Spacing.sm,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.lg,
        borderRadius: 9999,
        backgroundColor: Colors.primary,
    },
    retryText: {
        ...Typography.titleSmall,
        color: Colors.background,
    },
});
