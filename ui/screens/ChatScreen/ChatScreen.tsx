import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'

import { useSelector, useActions } from '@/ui/state/hooks'


interface ChatScreenProps {
    id: string
}


export const ChatScreen = ({ id }: ChatScreenProps) => {
    const scrollViewRef = useRef<ScrollView>(null)
    const actions = useActions()
    console.log('chat room id', id)
    const { messagesById, messagesLoading, messagesError } = useSelector(
        state => state.messages
    )
    const { chatsById } = useSelector(state => state.chats)
    const [isAIThinking, setIsAIThinking] = useState(false)

    const messages = useMemo(() => {
        return Object.values(messagesById).sort((a, b) => {
            const timestampA = a.timestamp || ''
            const timestampB = b.timestamp || ''
            return timestampA.localeCompare(timestampB)
        })
    }, [messagesById])

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false })
        }, 100)
        return () => clearTimeout(timer)
    }, [messages, isAIThinking])

    useEffect(() => {
        if (id) {
            actions.getMessages(id)
        }
    }, [id])

    return (
        <SafeAreaView style={{ flex: 1 }}>

        </SafeAreaView>
    )
}
