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
import { MessageTextInput } from '@/ui/components/MessageTextInput'
interface ChatScreenProps {
    id: string
}


const ThinkingIndicator = () => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => {
                if (prev.length >= 3) return '';
                return prev + '.';
            });
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.thinkingContainer}>
            <View style={styles.thinkingBubble}>
                <Text style={styles.thinkingText}>AI is thinking{dots}</Text>
            </View>
        </View>
    );
};

export const ChatScreen = ({ id }: ChatScreenProps) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const actions = useActions()

    const { messagesById, messagesLoading, messagesError } = useSelector(
        state => state.messages
    )

    const [isAIThinking, setIsAIThinking] = useState(false)

    const messages = useMemo(() => {
        return Object.values(messagesById).sort((a, b) => {
            const timestampA = a.timestamp || '';
            const timestampB = b.timestamp || '';
            return timestampA.localeCompare(timestampB);
        });
    }, [messagesById])

    useLayoutEffect(() => {
        const timer = setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
        }, 100);
        return () => clearTimeout(timer);
    }, [messages, isAIThinking]);



    useEffect(() => {
        if (id) {
            actions.getMessages(id)
        }
    }, [id])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                ref={scrollViewRef}
                style={styles.messages}
                contentContainerStyle={styles.messagesContent}
                showsVerticalScrollIndicator={false}
            >
                {messagesLoading ? (
                    <Spinner />
                ) : (
                    messages.map((message, index) =>
                        message.isAI ? (
                            <View style={styles.messageContainer} key={index}>
                                <View style={styles.message}>
                                    <Text style={styles.messageText}>
                                        {message.content}
                                    </Text>
                                </View>
                            </View>
                        ) : (
                            <View
                                style={[
                                    styles.messageContainer,
                                    styles.replyContainer,
                                ]}
                                key={index}
                            >
                                <View style={styles.replyMessage}>
                                    <Text style={styles.replyText}>
                                        {message.content}
                                    </Text>
                                </View>
                            </View>
                        )
                    )
                )}
                {isAIThinking && <ThinkingIndicator />}
            </ScrollView>

            <MessageTextInput
                onSubmit={() => { console.log('submit') }}
                scrollToBottom={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
                chatId={id}
                setIsAIThinking={(isAIThinking: boolean) => setIsAIThinking(isAIThinking)}
                aiIsThinking={isAIThinking}
            />
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
