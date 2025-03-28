import Constants from 'expo-constants'
import { Platform } from 'react-native'

const BACKEND_PORT = '3001'

function getBaseUrl() {
    try {
        if (Platform.OS === 'web') {
            return `http://localhost:${BACKEND_PORT}`
        }

        // For mobile development
        if (__DEV__) {
            // Try getting the local IP from Expo
            const debuggerHost =
                Constants.expoConfig?.hostUri ||
                Constants.manifest?.debuggerHost ||
                Constants.manifest2?.extra?.expoClient?.hostUri

            console.log('Expo debuggerHost:', debuggerHost)

            if (debuggerHost) {
                // Extract just the IP address, ignoring the Expo development server port
                const hostIP = debuggerHost.split(':')[0]
                console.log('Using host IP:', hostIP)

                // Special case for Android emulator
                if (
                    Platform.OS === 'android' &&
                    (hostIP === 'localhost' || hostIP === '127.0.0.1')
                ) {
                    console.log('Using Android emulator host: 10.0.2.2')
                    return `http://10.0.2.2:${BACKEND_PORT}`
                }

                // Use the IP with our backend port
                return `http://${hostIP}:${BACKEND_PORT}`
            }

            // Fallback for iOS simulator
            if (Platform.OS === 'ios') {
                return `http://localhost:${BACKEND_PORT}`
            }
        }

        // Production URL
        return 'https://your-production-api.com'
    } catch (error) {
        console.error('Error in getBaseUrl:', error)
        // Development fallback
        if (__DEV__) {
            return `http://localhost:${BACKEND_PORT}`
        }
        return 'https://your-production-api.com'
    }
}

// Get the API domain and log it for debugging
const apiDomain = getBaseUrl()
console.log('API Domain Configuration:', {
    domain: apiDomain,
    platform: Platform.OS,
    isDev: __DEV__,
    expoConfig: Constants.expoConfig,
    manifest: Constants.manifest,
})

export { apiDomain }
