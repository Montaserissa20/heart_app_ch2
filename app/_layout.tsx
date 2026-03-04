import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts, Lexend_400Regular, Lexend_700Bold } from '@expo-google-fonts/lexend';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { Colors } from '../src/components/theme';

SplashScreen.preventAutoHideAsync();

const MyDarkTheme = {
    ...DarkTheme,
    colors: {
        ...DarkTheme.colors,
        background: Colors.background,
        card: Colors.background,
        border: Colors.border,
        primary: Colors.primary,
        text: Colors.textPrimary,
    },
};

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Lexend_400Regular,
        Lexend_700Bold,
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ThemeProvider value={MyDarkTheme}>
            <View style={{ flex: 1, backgroundColor: Colors.background }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: Colors.background },
                        animation: 'slide_from_right',
                    }}
                >
                    <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                    <Stack.Screen name="category/[categoryId]" options={{ headerShown: false }} />
                    <Stack.Screen name="topic/[topicId]" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="light" />
            </View>
        </ThemeProvider>
    );
}
