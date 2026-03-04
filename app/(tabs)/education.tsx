import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { contentRepo, Category } from '../../src/data/contentRepo';
import { CategoryCard } from '../../src/components/CategoryCard';
import { LoadingState } from '../../src/components/LoadingState';
import { ErrorState } from '../../src/components/ErrorState';
import { Colors, Spacing, Typography } from '../../src/components/theme';

export default function EducationScreen() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [playingId, setPlayingId] = useState<string | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null);

    const load = useCallback(async () => {
        setStatus('loading');
        try {
            const data = await contentRepo.getCategories();
            setCategories(data);
            setStatus('success');
        } catch {
            setStatus('error');
        }
    }, []);

    useEffect(() => {
        load();
        return () => {
            soundRef.current?.unloadAsync();
        };
    }, [load]);

    const handlePlay = async (cat: Category) => {
        if (!cat.audioUrl) return;

        // If same card tapped, toggle off
        if (playingId === cat.id) {
            await soundRef.current?.pauseAsync();
            setPlayingId(null);
            return;
        }

        // Stop previous
        await soundRef.current?.unloadAsync();
        soundRef.current = null;
        setPlayingId(null);

        try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync(
                { uri: cat.audioUrl },
                { shouldPlay: true },
                (s) => {
                    if (s.isLoaded && s.didJustFinish) setPlayingId(null);
                }
            );
            soundRef.current = sound;
            setPlayingId(cat.id);
        } catch {
            setPlayingId(null);
        }
    };

    if (status === 'loading') {
        return (
            <SafeAreaView style={styles.root}>
                <Header />
                <LoadingState />
            </SafeAreaView>
        );
    }

    if (status === 'error') {
        return (
            <SafeAreaView style={styles.root}>
                <Header />
                <ErrorState
                    message="Could not load categories. Please check your connection."
                    onRetry={load}
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.root}>
            <Header />
            <FlatList
                data={categories}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.list}
                ListHeaderComponent={
                    <View style={styles.pageHeader}>
                        <Text style={styles.pageTitle}>Education Categories</Text>
                        <Text style={styles.pageSubtitle}>
                            Select a category to begin your recovery journey.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <CategoryCard
                        title={item.title}
                        isPlaying={playingId === item.id}
                        onPress={() => {
                            soundRef.current?.unloadAsync();
                            setPlayingId(null);
                            router.push(`/category/${item.id}`);
                        }}
                        onPlayPress={() => handlePlay(item)}
                    />
                )}
                ItemSeparatorComponent={() => <View style={{ height: Spacing.base }} />}
            />
        </SafeAreaView>
    );
}

function Header() {
    return (
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn}>
                <MaterialIcons name="arrow-back-ios" size={22} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Heart Surgery Guide</Text>
            <View style={styles.backBtn} />
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
        paddingHorizontal: Spacing.base,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        backgroundColor: Colors.background,
    },
    backBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        ...Typography.titleMedium,
        color: Colors.textPrimary,
        flex: 1,
        textAlign: 'center',
    },
    pageHeader: {
        paddingHorizontal: Spacing.lg,
        paddingTop: 40,
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
    list: {
        paddingHorizontal: Spacing.lg,
        paddingBottom: 40,
    },
});
