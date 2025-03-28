import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { useColorScheme } from '@/hooks/useColorScheme'
import { View } from 'react-native'
import { Provider } from 'react-redux'
import { store } from '@/ui/state/store'

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded, error] = useFonts({
        JetBrainsMono: require('../assets/fonts/JetBrainsMono-Regular.ttf'),
    })

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error
    }, [error])

    useEffect(() => {
        if (loaded) {
            // Hide splash screen once fonts are loaded
            SplashScreen.hideAsync().catch(console.error)
        }
    }, [loaded])

    if (!loaded) {
        return <View style={{ flex: 1, backgroundColor: '#fff' }} />
    }

    return <RootLayoutNav />
}

function RootLayoutNav() {
    const colorScheme = useColorScheme()

    return (
        <Provider store={store}>
            <GestureHandlerRootView style={styles.container}>
                <ThemeProvider
                    value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
                >
                    <Stack>
                        <Stack.Screen
                            name="index"
                            options={{
                                headerShown: false,
                            }}
                        />
                        {/* <Stack.Screen
                            name="chats"
                            options={{
                                headerShown: false,
                            }}
                        /> */}
                    </Stack>
                    <StatusBar
                        style={colorScheme === 'dark' ? 'light' : 'dark'}
                    />
                </ThemeProvider>
            </GestureHandlerRootView>
        </Provider>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
})
