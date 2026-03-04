import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, Typography, Radii } from '../../src/components/theme';

export default function ProfileScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.profileHeader}>
                    <View style={styles.avatarContainer}>
                        <MaterialIcons name="person" size={50} color={Colors.background} />
                    </View>
                    <Text style={styles.userName}>Jane Doe</Text>
                    <Text style={styles.userEmail}>jane.doe@example.com</Text>

                    <TouchableOpacity style={styles.editButton}>
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Preferences</Text>
                    <View style={styles.sectionContent}>
                        <View style={styles.settingRow}>
                            <View style={styles.settingIconContainer}>
                                <MaterialIcons name="notifications" size={20} color={Colors.textSecondary} />
                            </View>
                            <Text style={styles.settingText}>Daily Reminders</Text>
                            <Switch
                                value={notificationsEnabled}
                                onValueChange={setNotificationsEnabled}
                                trackColor={{ false: Colors.border, true: Colors.primary }}
                                thumbColor={Colors.white}
                                ios_backgroundColor={Colors.border}
                            />
                        </View>
                        <View style={styles.divider} />
                        <SettingRow icon="language" title="Language" value="English" />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Support</Text>
                    <View style={styles.sectionContent}>
                        <SettingRow icon="help-outline" title="Help Center" />
                        <View style={styles.divider} />
                        <SettingRow icon="lock-outline" title="Privacy Policy" />
                        <View style={styles.divider} />
                        <SettingRow icon="info-outline" title="Terms of Service" />
                    </View>
                </View>

                <TouchableOpacity style={styles.logoutButton}>
                    <MaterialIcons name="logout" size={20} color={Colors.error} />
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

function SettingRow({ icon, title, value }: { icon: any, title: string, value?: string }) {
    return (
        <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingIconContainer}>
                <MaterialIcons name={icon} size={20} color={Colors.textSecondary} />
            </View>
            <Text style={styles.settingText}>{title}</Text>
            {value ? (
                <Text style={styles.settingValue}>{value}</Text>
            ) : (
                <MaterialIcons name="chevron-right" size={24} color={Colors.textDisabled} />
            )}
        </TouchableOpacity>
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
    profileHeader: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: Radii.full,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: Spacing.md,
    },
    userName: {
        ...Typography.displayLarge,
        fontSize: 24,
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    userEmail: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
        marginBottom: Spacing.lg,
    },
    editButton: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: Radii.full,
        borderWidth: 1,
        borderColor: Colors.primary,
    },
    editButtonText: {
        ...Typography.titleSmall,
        color: Colors.primary,
    },
    section: {
        marginBottom: Spacing.xl,
    },
    sectionTitle: {
        ...Typography.label,
        color: Colors.textSecondary,
        marginBottom: Spacing.sm,
        marginLeft: Spacing.xs,
    },
    sectionContent: {
        backgroundColor: Colors.backgroundCard,
        borderRadius: Radii.lg,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.base,
    },
    settingIconContainer: {
        marginRight: Spacing.md,
    },
    settingText: {
        ...Typography.bodyLarge,
        color: Colors.textPrimary,
        flex: 1,
    },
    settingValue: {
        ...Typography.bodyMedium,
        color: Colors.textSecondary,
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: Spacing.xxl + 4, // Aligns with text
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: Spacing.base,
        backgroundColor: Colors.surface,
        borderRadius: Radii.lg,
        borderWidth: 1,
        borderColor: 'rgba(248,113,113,0.2)', // faint error color
        marginBottom: Spacing.xl,
    },
    logoutText: {
        ...Typography.titleMedium,
        color: Colors.error,
        marginLeft: Spacing.sm,
    },
    versionText: {
        ...Typography.bodySmall,
        color: Colors.textDisabled,
        textAlign: 'center',
    },
});
