import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
    Linking,
    Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Markdown, { RenderRules } from 'react-native-markdown-display';
import { contentRepo, Topic } from '../../src/data/contentRepo';
import { TopicAudioPlayer } from '../../src/components/TopicAudioPlayer';
import { FeedbackModal } from '../../src/components/FeedbackModal';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { Colors, Spacing, Radii, Typography } from '../../src/components/theme';

const TEXT_SIZE_KEY = '@reading_text_size';
type TextSize = 'Small' | 'Medium' | 'Large';

const TEXT_SIZES: { key: TextSize; fontSize: number; lineHeight: number }[] = [
    { key: 'Small', fontSize: 14, lineHeight: 22 },
    { key: 'Medium', fontSize: 17, lineHeight: 26 },
    { key: 'Large', fontSize: 21, lineHeight: 32 },
];

export default function TopicDetailScreen() {
    const { topicId } = useLocalSearchParams<{ topicId: string }>();
    const router = useRouter();
    const [topic, setTopic] = useState<Topic | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [textSize, setTextSize] = useState<TextSize>('Medium');
    const [feedbackVisible, setFeedbackVisible] = useState(false);

    const load = useCallback(async () => {
        setStatus('loading');
        try {
            const [t, savedSize] = await Promise.all([
                contentRepo.getTopic(topicId ?? ''),
                AsyncStorage.getItem(TEXT_SIZE_KEY),
            ]);
            if (!t) throw new Error('Not found');
            setTopic(t);
            if (savedSize && (savedSize === 'Small' || savedSize === 'Medium' || savedSize === 'Large')) {
                setTextSize(savedSize as TextSize);
            }
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }, [topicId]);

    useEffect(() => {
        load();
    }, [load]);

    const handleTextSize = async (size: TextSize) => {
        setTextSize(size);
        await AsyncStorage.setItem(TEXT_SIZE_KEY, size);
    };

    const activeSize = TEXT_SIZES.find((s) => s.key === textSize) ?? TEXT_SIZES[1];

    const markdownRules: RenderRules = {
        heading3: (node, children, parent, styles) => {
            const content = node.children[0].content as string;
            let icon: keyof typeof MaterialIcons.glyphMap = 'info-outline';
            if (content.includes('Breathing')) icon = 'air';
            if (content.includes('Mobility')) icon = 'directions-walk';

            return (
                <View key={node.key} style={styles.heading3Container}>
                    <MaterialIcons name={icon} size={22} color={Colors.primary} style={{ marginRight: 8 }} />
                    <Text style={styles.heading3}>{children}</Text>
                </View>
            );
        },
        blockquote: (node, children, parent, styles) => (
            <View key={node.key} style={styles.blockquote}>
                <Text style={styles.blockquoteText}>{children}</Text>
            </View>
        ),
    };

    const markdownStyles = StyleSheet.create({
        body: {
            color: Colors.textSecondary,
            fontSize: activeSize.fontSize,
            lineHeight: activeSize.lineHeight,
        },
        heading1: {
            ...Typography.displayLarge,
            color: Colors.textPrimary,
            fontSize: 24,
            marginBottom: 16,
            marginTop: 0,
        },
        heading3Container: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 24,
            marginBottom: 8,
        },
        heading3: {
            ...Typography.titleMedium,
            color: Colors.textPrimary,
            fontSize: 18,
            marginBottom: 0,
        },
        paragraph: {
            marginBottom: 16,
        },
        blockquote: {
            marginVertical: 24,
            padding: 16,
            backgroundColor: 'rgba(43, 238, 222, 0.05)',
            borderLeftWidth: 4,
            borderLeftColor: Colors.primary,
            borderRadius: Radii.lg,
        },
        blockquoteText: {
            ...Typography.bodyMedium,
            color: 'rgba(241, 245, 249, 0.7)',
            fontStyle: 'italic',
            fontSize: activeSize.fontSize,
            lineHeight: activeSize.lineHeight,
        },
    });

    if (status === 'loading') return <SafeAreaView style={styles.root}><LoadingState /></SafeAreaView>;
    if (status === 'error') return <SafeAreaView style={styles.root}><ErrorState message="Could not load topic." onRetry={load} /></SafeAreaView>;
    if (!topic) return null;

    return (
        <SafeAreaView style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Surgery Recovery</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Audio Player */}
                {topic.audioUrl && (
                    <View style={styles.section}>
                        <TopicAudioPlayer
                            audioUrl={topic.audioUrl}
                            title={topic.title}
                            narrator={topic.narrator}
                        />
                    </View>
                )}

                {/* Text Size Selector */}
                <View style={styles.sizeSection}>
                    <Text style={styles.sizeTitle}>ADJUST READING SIZE</Text>
                    <View style={styles.sizeContainer}>
                        {['Small', 'Medium', 'Large'].map((sz) => (
                            <TouchableOpacity
                                key={sz}
                                style={[styles.sizeBtn, textSize === sz && styles.sizeBtnActive]}
                                onPress={() => handleTextSize(sz as TextSize)}
                            >
                                <Text style={[styles.sizeBtnText, textSize === sz && styles.sizeBtnTextActive]}>
                                    {sz}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Markdown Body */}
                <View style={styles.article}>
                    <Markdown rules={markdownRules} style={markdownStyles}>
                        {`# ${topic.title}\n\n${topic.body}`}
                    </Markdown>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    {topic.videoUrl && (
                        <TouchableOpacity
                            style={styles.videoBtn}
                            onPress={() => Linking.openURL(topic.videoUrl!)}
                        >
                            <MaterialIcons name="play-circle" size={24} color={Colors.background} />
                            <Text style={styles.videoBtnText}>Watch Educational Video</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        style={styles.feedbackBtn}
                        onPress={() => setFeedbackVisible(true)}
                    >
                        <MaterialIcons name="rate-review" size={20} color={Colors.textSecondary} />
                        <Text style={styles.feedbackBtnText}>Give Feedback</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <FeedbackModal
                topicId={topic.id}
                visible={feedbackVisible}
                onClose={() => setFeedbackVisible(false)}
            />
        </SafeAreaView>
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
        paddingHorizontal: Spacing.base,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        ...Typography.titleMedium,
        color: Colors.textPrimary,
        fontWeight: '700',
    },
    backBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scrollContent: {
        paddingBottom: 40,
    },
    section: {
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.md,
    },
    sizeSection: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.lg,
        alignItems: 'center',
    },
    sizeTitle: {
        ...Typography.label,
        color: Colors.textSecondary,
        fontSize: 10,
        letterSpacing: 2,
        marginBottom: 12,
    },
    sizeContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: Radii.lg,
        padding: 4,
        width: '100%',
    },
    sizeBtn: {
        flex: 1,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Radii.md,
    },
    sizeBtnActive: {
        backgroundColor: 'rgba(255,255,255,0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sizeBtnText: {
        ...Typography.bodySmall,
        color: Colors.textSecondary,
        fontWeight: '500',
    },
    sizeBtnTextActive: {
        color: Colors.primary,
        fontWeight: '700',
    },
    article: {
        paddingHorizontal: Spacing.lg + 4,
    },
    actions: {
        paddingHorizontal: Spacing.lg,
        marginTop: 20,
        gap: 12,
    },
    videoBtn: {
        flexDirection: 'row',
        height: 56,
        backgroundColor: Colors.textPrimary,
        borderRadius: Radii.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    videoBtnText: {
        ...Typography.titleSmall,
        color: Colors.background,
        fontWeight: '700',
    },
    feedbackBtn: {
        flexDirection: 'row',
        height: 56,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.05)',
        borderRadius: Radii.xl,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    feedbackBtnText: {
        ...Typography.titleSmall,
        color: Colors.textSecondary,
        fontWeight: '700',
    },
});
