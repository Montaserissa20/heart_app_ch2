import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radii, Typography } from './theme';

const STORAGE_KEY = '@feedback_submissions';

interface FeedbackModalProps {
    topicId: string;
    visible: boolean;
    onClose: () => void;
}

export function FeedbackModal({ topicId, visible, onClose }: FeedbackModalProps) {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!message.trim()) {
            Alert.alert('Required', 'Please enter a message before submitting.');
            return;
        }
        setSubmitting(true);
        try {
            const stored = await AsyncStorage.getItem(STORAGE_KEY);
            const existing = stored ? JSON.parse(stored) : [];
            const entry = {
                id: Date.now().toString(),
                topicId,
                name: name.trim() || 'Anonymous',
                message: message.trim(),
                submittedAt: new Date().toISOString(),
            };
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, entry]));
            setName('');
            setMessage('');
            onClose();
            Alert.alert('Thanks!', 'Your feedback has been saved.');
        } catch {
            Alert.alert('Error', 'Could not save feedback. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.overlay}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={styles.sheet}>
                    <View style={styles.handle} />
                    <Text style={styles.title}>Leave Feedback</Text>
                    <Text style={styles.label}>Name (optional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Your name"
                        placeholderTextColor={Colors.textDisabled}
                        value={name}
                        onChangeText={setName}
                    />
                    <Text style={styles.label}>Message *</Text>
                    <TextInput
                        style={[styles.input, styles.multiline]}
                        placeholder="Share your thoughts or questions…"
                        placeholderTextColor={Colors.textDisabled}
                        value={message}
                        onChangeText={setMessage}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                    <View style={styles.actions}>
                        <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.submitBtn, submitting && styles.submittingBtn]}
                            onPress={handleSubmit}
                            disabled={submitting}
                        >
                            <Text style={styles.submitText}>{submitting ? 'Saving…' : 'Submit'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    sheet: {
        backgroundColor: Colors.backgroundCard ?? '#1a3330',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: Spacing.lg,
        paddingBottom: 40,
        gap: Spacing.sm,
    },
    handle: {
        alignSelf: 'center',
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: Colors.border,
        marginBottom: Spacing.base,
    },
    title: {
        ...Typography.titleLarge,
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
    },
    label: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        marginTop: Spacing.xs,
    },
    input: {
        backgroundColor: Colors.surface ?? '#1e3d39',
        borderRadius: Radii.md,
        borderWidth: 1,
        borderColor: Colors.border,
        color: Colors.textPrimary,
        fontFamily: 'Lexend_400Regular',
        fontSize: 15,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    multiline: {
        minHeight: 100,
        paddingTop: Spacing.sm,
    },
    actions: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.sm,
    },
    cancelBtn: {
        flex: 1,
        paddingVertical: Spacing.sm,
        borderRadius: Radii.full,
        borderWidth: 1.5,
        borderColor: Colors.border,
        alignItems: 'center',
    },
    cancelText: {
        ...Typography.titleSmall,
        color: Colors.textSecondary,
    },
    submitBtn: {
        flex: 2,
        paddingVertical: Spacing.sm,
        borderRadius: Radii.full,
        backgroundColor: Colors.primary,
        alignItems: 'center',
    },
    submittingBtn: {
        opacity: 0.6,
    },
    submitText: {
        ...Typography.titleSmall,
        color: Colors.background,
    },
});
