import { useState, useMemo, useEffect, useRef, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native'

import { useSelector, useActions } from '@/ui/state/hooks'
import { MessageTextInput, Spinner, TruncatedText, ThinkingIndicator } from '@/ui/components'

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
                                    <TruncatedText
                                        text={message.content || ''}
                                        maxLines={3}
                                        style={{
                                            color: 'white',
                                            fontSize: 16,
                                            fontFamily: 'JetBrainsMono',
                                            lineHeight: 24,
                                        }}
                                    />
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
                {messagesError && <Text>Error loading messages</Text>}
                {messages.length === 0 && (
                    <View style={styles.messageContainer}>
                        <View style={styles.message}>
                            <TruncatedText
                                text={`Hi there! I'm your AI assistant and I will assist you through your chat: ${chatsById[id].title}. What's on your mind?`}
                                maxLines={8}
                                style={{
                                    color: 'white',
                                    fontSize: 16,
                                    fontFamily: 'JetBrainsMono',
                                    lineHeight: 24,
                                }}
                            />
                        </View>
                    </View>
                )}
            </ScrollView>

            <MessageTextInput
                onSubmit={() => {
                    console.log('submit')
                }}
                scrollToBottom={() =>
                    scrollViewRef.current?.scrollToEnd({ animated: true })
                }
                chatId={id}
                setIsAIThinking={(isAIThinking: boolean) =>
                    setIsAIThinking(isAIThinking)
                }
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
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontFamily: 'JetBrainsMono',
        lineHeight: 24,
        color: '#000000',
    },
})
