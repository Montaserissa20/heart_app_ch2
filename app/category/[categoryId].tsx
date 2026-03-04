import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { contentRepo, Topic } from '../../src/data/contentRepo';
import { TopicRow } from '../../src/components/TopicRow';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { EmptyState } from '../../src/components/EmptyState';
import { Colors, Spacing, Radii, Typography } from '../../src/components/theme';

export default function CategoryScreen() {
    const { categoryId } = useLocalSearchParams<{ categoryId: string }>();
    const router = useRouter();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [categoryTitle, setCategoryTitle] = useState('');
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [search, setSearch] = useState('');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);

    const load = useCallback(async () => {
        setStatus('loading');
        try {
            const [cat, tps] = await Promise.all([
                contentRepo.getCategory(categoryId ?? ''),
                contentRepo.getTopicsByCategory(categoryId ?? ''),
            ]);
            setCategoryTitle(cat?.title ?? 'Category');
            setTopics(tps);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }, [categoryId]);

    useEffect(() => {
        load();
        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [load]);

    const handlePlay = async (topic: Topic) => {
        if (!topic.audioUrl) return;
        if (playingId === topic.id) {
            await soundRef.current?.pauseAsync();
            setPlayingId(null);
            return;
        }
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
        setPlayingId(null);
        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync(
                { uri: topic.audioUrl },
                { shouldPlay: true },
                (s) => { if (s.isLoaded && s.didJustFinish) setPlayingId(null); }
            );
            soundRef.current = sound;
            setPlayingId(topic.id);
        } catch {
            setPlayingId(null);
        }
    };

    const filtered = topics.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView style={styles.root}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back-ios" size={22} color={Colors.primary} />
                </TouchableOpacity>
                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>{categoryTitle}</Text>
                    <Text style={styles.headerSubtitle}>CATEGORY</Text>
                </View>
                <TouchableOpacity style={styles.profileBtn}>
                    <MaterialIcons name="person" size={24} color={Colors.primary} />
                </TouchableOpacity>
            </View>

            {status === 'loading' && <LoadingState />}
            {status === 'error' && (
                <ErrorState
                    message="Could not load topics."
                    onRetry={load}
                />
            )}
            {status === 'success' && (
                <>
                    {/* Search */}
                    <View style={styles.searchSection}>
                        <View style={styles.searchContainer}>
                            <MaterialIcons name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search subtopics..."
                                placeholderTextColor="rgba(43, 238, 222, 0.4)"
                                value={search}
                                onChangeText={setSearch}
                                returnKeyType="search"
                            />
                        </View>
                    </View>

                    <FlatList
                        data={filtered}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.list}
                        ListEmptyComponent={
                            <EmptyState message={search ? 'No topics match your search.' : 'No topics in this category yet.'} />
                        }
                        renderItem={({ item }) => (
                            <TopicRow
                                title={item.title}
                                duration="8:45" // Mocking duration for now
                                icon={item.icon as any || 'medical-information'}
                                isPlaying={playingId === item.id}
                                onPress={() => {
                                    soundRef.current?.unloadAsync();
                                    setPlayingId(null);
                                    router.push(`/topic/${item.id}`);
                                }}
                                onPlayPress={() => handlePlay(item)}
                            />
                        )}
                    />
                </>
            )}
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
        paddingTop: 8,
        paddingBottom: Spacing.base,
        justifyContent: 'space-between',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        ...Typography.titleLarge,
        color: Colors.textPrimary,
        textAlign: 'center',
    },
    headerSubtitle: {
        ...Typography.label,
        color: 'rgba(43, 238, 222, 0.7)',
        fontSize: 10,
        letterSpacing: 2,
    },
    backBtn: {
        width: 48,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(43, 238, 222, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    searchSection: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.base,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(43, 238, 222, 0.05)',
        borderRadius: Radii.md,
        height: 52,
        paddingHorizontal: Spacing.base,
    },
    searchIcon: {
        marginRight: Spacing.sm,
    },
    searchInput: {
        flex: 1,
        color: Colors.textPrimary,
        ...Typography.bodyMedium,
        height: 52,
    },
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 100,
    },
});
