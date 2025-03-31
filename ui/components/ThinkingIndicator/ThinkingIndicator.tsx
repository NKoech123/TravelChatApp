import { View, Text } from "react-native"

import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

export const ThinkingIndicator = () => {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return ''
                return prev + '.'
            })
        }, 500)

        return () => clearInterval(interval)
    }, [])

    return (
        <View style={styles.thinkingContainer}>
            <View style={styles.thinkingBubble}>
                <Text style={styles.thinkingText}>AI is thinking{dots}</Text>
            </View>
        </View>
    )
}



const styles = StyleSheet.create({

    thinkingContainer: {
        marginBottom: 16,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        position: 'relative',
    },
    thinkingBubble: {
        backgroundColor: '#000',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderBottomLeftRadius: 0,
        position: 'relative',
        marginLeft: 4,
        opacity: 0.7,
    },
    thinkingText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'JetBrainsMono',
        lineHeight: 24,
    },
})

