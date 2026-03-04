import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from './theme';

interface EmptyStateProps {
    message?: string;
}

export function EmptyState({ message = 'No items found.' }: EmptyStateProps) {
    return (
        <View style={styles.container}>
            <MaterialIcons name="search-off" size={56} color={Colors.textDisabled ?? '#475569'} />
            <Text style={styles.message}>{message}</Text>
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
});
