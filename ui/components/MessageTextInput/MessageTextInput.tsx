import { FC, useEffect } from 'react'

import { useState } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native'
import { ArrowUpIcon } from 'react-native-heroicons/mini'
import { MessageSchema } from '@nicholas/types'
import { useActions } from '@/ui/state/hooks'

interface MessageTextInputProps {
    onSubmit: () => void
    scrollToBottom: () => void
    setIsAIThinking: (isAIThinking: boolean) => void
    aiIsThinking: boolean
    chatId: string
}

export const MessageTextInput: FC<MessageTextInputProps> = ({
    onSubmit,
    scrollToBottom,
    chatId,
    aiIsThinking,
    setIsAIThinking,
}) => {
    const actions = useActions()
    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        if (!newMessage.trim()) return

        scrollToBottom()
        setNewMessage('')
        actions.upsertMessage({
            chatId: chatId,
            message: {
                isAI: false,
                chatId: chatId,
                content: newMessage,
            },
            handleSuccess: (messages: MessageSchema[]) => {
                scrollToBottom()

                // LLM call
                setIsAIThinking(true)

                actions.upsertMessage({
                    chatId: chatId,
                    message: {
                        isAI: true,
                        content: messages[0].content,
                    },
                    handleSuccess: (messages: MessageSchema[]) => {
                        setIsAIThinking(false)
                        scrollToBottom()
                    },
                })
            },
        })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
            style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: '#FDF8EF',
            }}
        >
            <View
                style={{
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    padding: 16,
                    backgroundColor: '#FDF8EF',
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: 'white',
                        borderRadius: 24,
                        paddingHorizontal: 12,
                        borderWidth: 1,
                        borderColor: '#00000033',
                    }}
                >
                    <TextInput
                        style={{
                            flex: 1,
                            fontSize: 16,
                            paddingVertical: 12,
                            paddingHorizontal: 8,
                            fontFamily: 'JetBrainsMono',
                        }}
                        placeholder="Tell us your travel plans..."
                        placeholderTextColor="#999"
                        multiline
                        onChangeText={text => setNewMessage(text)}
                        value={newMessage}
                    />

                    <TouchableOpacity
                        style={{
                            padding: 8,
                        }}
                        disabled={!newMessage}
                        onPress={handleSendMessage}
                    >
                        <ArrowUpIcon size={24} color="#000000" />
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}
