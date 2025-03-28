import { useState } from 'react'
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
} from 'react-native'
import { ArrowUpIcon } from 'react-native-heroicons/mini';
import { MessageSchema } from '@nicholas/types';

interface ChatScreenProps {
    id: string
}

export const ChatScreen = ({ id }: ChatScreenProps) => {
    const [messages, setMessages] = useState<MessageSchema[]>([
        {
            id: '1',
            content: 'Hey Nicholas',
            isAI: true,
            chatId: id,
            userId: '1',
            timestamp: new Date().toISOString(),
        },
        {
            id: '2',
            content: 'Where are you looking to go',
            isAI: false,
            chatId: id,
            userId: '1',
            timestamp: new Date().toISOString(),
        },
    ])

    const [newMessage, setNewMessage] = useState('')

    const handleSendMessage = () => {
        console.log('send message')
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.messages}>
                {messages.map((message, index) => (
                    message.isAI ? (
                        <View style={styles.messageContainer} key={index}>
                            <View style={styles.message}>
                                <Text style={styles.messageText}>
                                    {message.content}
                                </Text>
                            </View>
                        </View>
                    ) : (
                        <View style={[styles.messageContainer, styles.replyContainer]} key={index}>
                            <View style={styles.replyMessage}>
                                <Text style={styles.replyText}>{message.content}</Text>
                            </View>
                        </View>
                    )
                ))}

            </View>

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
                    />

                    <TouchableOpacity style={styles.sendButton}
                        disabled={!newMessage}
                        onPress={handleSendMessage}
                    >
                        <ArrowUpIcon size={24} color="#000000" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        marginRight: 28, // To offset the back button width and keep title centered
    },
    messages: {
        flex: 1,
        padding: 16,
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
        transform: [{ rotate: '-1deg' }],
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
        transform: [{ rotate: '1deg' }],
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
