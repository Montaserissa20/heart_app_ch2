import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../src/components/theme';

export default function ProgressScreen() {
    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Progress</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.pageHeader}>
                    <Text style={styles.pageTitle}>Recovery Stats</Text>
                    <Text style={styles.pageSubtitle}>
                        You are doing great! Keep up the good work.
                    </Text>
                </View>

                {/* Main Stat Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroHeader}>
                        <MaterialIcons name="local-fire-department" size={24} color={Colors.primary} />
                        <Text style={styles.heroTitle}>Current Streak</Text>
                    </View>
                    <Text style={styles.heroValue}>12 Days</Text>
                    <Text style={styles.heroSubtitle}>Personal best: 15 days</Text>

                    {/* Progress Bar */}
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBarFill, { width: '80%' }]} />
                    </View>
                    <Text style={styles.progressText}>3 days until new record!</Text>
                </View>

                <View style={styles.statsGrid}>
                    <StatBox
                        title="Exercises"
                        value="24"
                        icon="fitness-center"
                        color="#a78bfa" // purple-400
                    />
                    <StatBox
                        title="Chapters"
                        value="8"
                        icon="menu-book"
                        color="#fb923c" // orange-400
                    />
                    <StatBox
                        title="Minutes"
                        value="142"
                        icon="timer"
                        color="#4ade80" // green-400
                    />
                    <StatBox
                        title="Insights"
                        value="4"
                        icon="lightbulb"
                        color="#facc15" // yellow-400
                    />
                </View>

                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <View style={styles.activityCard}>
                    <ActivityRow title="Completed 'Deep Breathing'" time="2 hours ago" icon="check-circle" />
                    <ActivityRow title="Read 'Understanding Recovery'" time="Yesterday" icon="menu-book" />
                    <ActivityRow title="Completed 'Gentle Walking'" time="Yesterday" icon="check-circle" />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function StatBox({ title, value, icon, color }: { title: string, value: string, icon: any, color: string }) {
    return (
        <View style={styles.statBox}>
            <View style={[styles.statIconContainer, { backgroundColor: `${color}20` }]}>
                <MaterialIcons name={icon} size={22} color={color} />
            </View>
            <Text style={styles.statValue}>{value}</Text>
            <Text style={styles.statTitle}>{title}</Text>
        </View>
    );
}

function ActivityRow({ title, time, icon }: { title: string, time: string, icon: any }) {
    return (
        <View style={styles.activityRow}>
            <View style={styles.activityIcon}>
                <MaterialIcons name={icon} size={18} color={Colors.primary} />
            </View>
            <View style={styles.activityText}>
                <Text style={styles.activityTitle}>{title}</Text>
                <Text style={styles.activityTime}>{time}</Text>
            </View>
        </View>
    );
}

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
    heroCard: {
        backgroundColor: Colors.surface,
        borderRadius: Radii.xl,
        padding: Spacing.lg,
        marginBottom: Spacing.lg,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    heroHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.sm,
    },
    heroTitle: {
        ...Typography.titleMedium,
        color: Colors.textPrimary,
        marginLeft: Spacing.xs,
    },
    heroValue: {
        fontFamily: 'Lexend_700Bold',
        fontSize: 48,
        color: Colors.textPrimary,
        lineHeight: 56,
    },
    heroSubtitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: Radii.full,
        marginBottom: Spacing.xs,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: Radii.full,
    },
    progressText: {
        ...Typography.label,
        color: Colors.primary,
        textAlign: 'right',
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: Spacing.xl,
    },
    statBox: {
        width: '48%',
        backgroundColor: Colors.backgroundCard,
        borderRadius: Radii.lg,
        padding: Spacing.base,
        marginBottom: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    statIconContainer: {
        width: 36,
        height: 36,
        borderRadius: Radii.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    statValue: {
        ...Typography.titleLarge,
        color: Colors.textPrimary,
        marginBottom: 2,
    },
    statTitle: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
    },
    sectionTitle: {
        ...Typography.titleMedium,
        color: Colors.textPrimary,
        marginBottom: Spacing.md,
    },
    activityCard: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: Radii.lg,
        padding: Spacing.base,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    activityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
    },
    activityIcon: {
        marginRight: Spacing.md,
    },
    activityText: {
        flex: 1,
    },
    activityTitle: {
        ...Typography.bodyMedium,
        color: Colors.textPrimary,
    },
    activityTime: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: 2,
    },
});
