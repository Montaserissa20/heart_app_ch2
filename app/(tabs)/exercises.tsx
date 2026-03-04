import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../src/components/theme';

export default function ExercisesScreen() {
    const [selectedExercise, setSelectedExercise] = useState<number | null>(null);
    const scaleAnim = new Animated.Value(1);

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Daily Exercises</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Your Routine</Text>
                    <Text style={styles.pageSubtitle}>
                        Complete these exercises to strengthen your heart.
                    </Text>
                </View>

                {EXERCISES.map((exercise, index) => {
                    const isSelected = selectedExercise === index;
                    return (
                        <TouchableOpacity
                            key={index}
                            activeOpacity={0.9}
                            onPressIn={handlePressIn}
                            onPressOut={handlePressOut}
                            onPress={() => setSelectedExercise(isSelected ? null : index)}
                        >
                            <Animated.View
                                style={[
                                    styles.card,
                                    isSelected && styles.cardSelected,
                                    { transform: [{ scale: scaleAnim }] }
                                ]}
                            >
                                <View style={styles.cardHeader}>
                                    <View style={[styles.iconContainer, { backgroundColor: `${exercise.color}20` }]}>
                                        <MaterialIcons name={exercise.icon as any} size={28} color={exercise.color} />
                                    </View>
                                    <View style={styles.cardHeaderText}>
                                        <Text style={styles.cardTitle}>{exercise.title}</Text>
                                        <Text style={styles.cardDuration}>{exercise.duration}</Text>
                                    </View>
                                    <MaterialIcons
                                        name={isSelected ? "keyboard-arrow-up" : "keyboard-arrow-down"}
                                        size={24}
                                        color={Colors.textSecondary}
                                    />
                                </View>

                                {isSelected && (
                                    <View style={styles.cardBody}>
                                        <Text style={styles.cardDescription}>{exercise.description}</Text>
                                        <TouchableOpacity style={styles.startButton}>
                                            <MaterialIcons name="play-arrow" size={20} color={Colors.background} />
                                            <Text style={styles.startButtonText}>Start Exercise</Text>
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </Animated.View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

const EXERCISES = [
    {
        title: 'Deep Breathing',
        duration: '5 mins',
        icon: 'air',
        color: Colors.primary,
        description: 'Take slow, deep breaths to expand your lungs and promote relaxation. Focus on breathing from your diaphragm.',
    },
    {
        title: 'Gentle Walking',
        duration: '15 mins',
        icon: 'directions-walk',
        color: '#a78bfa', // purple-400
        description: 'Take a short, slow walk around your home or a flat surface. Stop immediately if you feel dizzy or short of breath.',
    },
    {
        title: 'Ankle Pumps',
        duration: '3 mins',
        icon: 'accessibility-new',
        color: '#fb923c', // orange-400
        description: 'While sitting or lying down, point your toes up toward your head, then down toward the floor. Repeat 10-15 times per leg.',
    },
];

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.background,
    },
    headerTitle: {
        ...Typography.titleMedium,
        color: Colors.textPrimary,
    },
    scrollContent: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
    pageHeader: {
        paddingTop: 30,
        paddingBottom: Spacing.lg,
    },
    pageTitle: {
        ...Typography.displayLarge,
        color: Colors.textPrimary,
    },
    pageSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    card: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: Radii.lg,
        padding: Spacing.base,
        marginBottom: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    cardSelected: {
        borderColor: Colors.primary,
        backgroundColor: Colors.surface,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: Radii.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    cardHeaderText: {
        flex: 1,
    },
    cardTitle: {
        ...Typography.titleMedium,
        color: Colors.textPrimary,
    },
    cardDuration: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: 2,
    },
    cardBody: {
        marginTop: Spacing.md,
        paddingTop: Spacing.md,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    cardDescription: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        marginBottom: Spacing.md,
    },
    startButton: {
        backgroundColor: Colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.md,
        borderRadius: Radii.md,
    },
    startButtonText: {
        ...Typography.titleSmall,
        color: Colors.background,
        marginLeft: Spacing.xs,
    },
});
