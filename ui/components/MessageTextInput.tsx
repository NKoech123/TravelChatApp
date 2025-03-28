import { FC } from 'react';

import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
} from 'react-native'
import { ArrowUpIcon } from 'react-native-heroicons/mini'
import { MessageSchema } from '@nicholas/types'
import { useSelector, useActions } from '@/ui/state/hooks'
import { Spinner } from '@/ui/components/Spinner'

interface MessageTextInputProps {
    onSubmit: () => void;
    scrollToBottom: () => void;
    setIsAIThinking: (isAIThinking: boolean) => void;
    aiIsThinking: boolean;
    chatId: string;
}

export const MessageTextInput: FC<MessageTextInputProps> = ({ onSubmit, scrollToBottom, chatId, aiIsThinking }) => {

    const actions = useActions()

    const [newMessage, setNewMessage] = useState('');
    const [isAIThinking, setIsAIThinking] = useState(aiIsThinking);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        // scrollViewRef.current?.scrollToEnd({ animated: true });
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
                // Scroll to bottom immediately after sending
                // scrollViewRef.current?.scrollToEnd({ animated: true });
                scrollToBottom()

                // LLM call to get response
                setIsAIThinking(true)
                // Add delay before sending AI message
                setTimeout(() => {
                    actions.upsertMessage({
                        chatId: chatId,
                        message: {
                            isAI: true,
                            content: messages[0].content,
                        },
                        handleSuccess: (messages: MessageSchema[]) => {
                            setIsAIThinking(false)

                        },
                    })
                }, 5000) // 5000 milliseconds = 5 seconds
            },
        })
    }


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.inputContainer}
        >
            <View style={styles.inputWrapper}>
                <TextInput
                    style={styles.input}
                    placeholder="Tell us your travel plans..."
                    placeholderTextColor="#999"
                    multiline
                    onChangeText={text => setNewMessage(text)}
                    value={newMessage}
                />

                <TouchableOpacity
                    style={styles.sendButton}
                    disabled={!newMessage}
                    onPress={handleSendMessage}
                >
                    <ArrowUpIcon size={24} color="#000000" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        backgroundColor: '#FDF8EF',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'JetBrainsMono',
        marginRight: 28,
    },
    messages: {
        flex: 1,
    },
    messagesContent: {
        padding: 16,
        paddingBottom: 80,
        flexGrow: 1,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        position: 'relative',
    },
    message: {
        backgroundColor: '#000',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderBottomLeftRadius: 0,
        position: 'relative',
        marginLeft: 4,
    },
    messageText: {
        color: 'white',
        fontSize: 16,
        fontFamily: 'JetBrainsMono',
        lineHeight: 24,
    },
    replyContainer: {
        alignSelf: 'flex-end',
        marginBottom: 16,
    },
    replyMessage: {
        backgroundColor: '#F5E6D3',
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 24,
        borderBottomRightRadius: 0,
        position: 'relative',
        marginRight: 4,
    },
    replyText: {
        color: '#000000',
        fontSize: 16,
        fontFamily: 'JetBrainsMono',
        lineHeight: 24,
    },
    inputContainer: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        padding: 16,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 24,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#00000033',
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 8,
        fontFamily: 'JetBrainsMono',
    },
    sendButton: {
        padding: 8,
    },

})


