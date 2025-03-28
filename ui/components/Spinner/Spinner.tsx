import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

interface SpinnerProps {
    size?: 'small' | 'large'
    fullscreen?: boolean
}

export function Spinner({ size = 'large', fullscreen = false }: SpinnerProps) {
    const backgroundColor = useThemeColor({}, 'background')
    const tintColor = useThemeColor({}, 'tint')

    if (fullscreen) {
        return (
            <View
                style={[
                    styles.container,
                    styles.fullscreen,
                    { backgroundColor },
                ]}
            >
                <ActivityIndicator size={size} color={tintColor} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <ActivityIndicator size={size} color={tintColor} />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fullscreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
    },
})
