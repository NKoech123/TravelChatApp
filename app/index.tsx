import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
} from 'react-native'
import ChatItem from '@/ui/components/ChatItem/ChatItem'
import { PlusIcon } from 'react-native-heroicons/mini'
import { useSelector, useActions } from '@/ui/state/hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { NewChatForm, CustomBottomSheet, Spinner } from '@/ui/components'

export default function HomeScreen() {
    const actions = useActions()
    const initialRender = useRef(true)
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)
    const [isCreatingNewChat, setIsCreatingNewChat] = useState(false)

    const { chatsById, chatsLoading, chatsError } = useSelector(
        state => state.chats
    )

    const chats = useMemo(() => {
        return Object.values(chatsById).sort(
            (a, b) =>
                new Date(b.timestamp as string).getTime() -
                new Date(a.timestamp as string).getTime()
        )
    }, [chatsById])

    useEffect(() => {
        if (initialRender.current) {
            actions.getChats()
            initialRender.current = false
        }
    }, [])

    useEffect(() => {
        if (chatsError) {
            console.error(chatsError)
        }
    }, [chatsError])

    useEffect(() => {
        const keyboardWillShow = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            () => {
                setIsKeyboardVisible(true)
            }
        )
        const keyboardWillHide = Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => {
                setIsKeyboardVisible(false)
            }
        )

        return () => {
            keyboardWillShow.remove()
            keyboardWillHide.remove()
        }
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chat with me</Text>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
            >
                {chatsLoading && <Spinner />}

                {chats.map(chat => (
                    <ChatItem
                        key={chat.id}
                        title={chat.title}
                        time={chat.timestamp as string}
                        id={chat.id as string}
                    />
                ))}
            </ScrollView>

            {!isCreatingNewChat && (
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setIsCreatingNewChat(true)}
                >
                    <PlusIcon size={24} color="white" />
                    <Text style={styles.createButtonText}>CREATE NEW</Text>
                </TouchableOpacity>
            )}

            <CustomBottomSheet
                visible={isCreatingNewChat}
                onClose={() => setIsCreatingNewChat(false)}
                title="Add new chat"
                hideTitle={true}
                scrollable={false}
                useModal={true}
                snapPoints={[isKeyboardVisible ? '90%' : '65%']}
                enableContentPanningGesture={false}
            >
                <NewChatForm closeModal={() => setIsCreatingNewChat(false)} />
            </CustomBottomSheet>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FDF8EF',
    },
    header: {
        padding: 16,
        paddingTop: 24,
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    createButton: {
        backgroundColor: 'black',
        margin: 16,
        padding: 16,
        borderRadius: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    createButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
        fontFamily: 'JetBrainsMono',
    },
    formContainer: {
        margin: 16,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#00000033',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 20,
        color: '#333',
    },
    inputField: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#F8F8F8',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        marginTop: 8,
    },
    button: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: 'black',
    },
    cancelButton: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'black',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '500',
    },
    cancelButtonText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '500',
    },
    keyboardAvoidingView: {
        flex: 1,
        width: '100%',
    },
    formWrapper: {
        flex: 1,
        width: '100%',
        paddingBottom: Platform.OS === 'ios' ? 20 : 0,
    },
})
