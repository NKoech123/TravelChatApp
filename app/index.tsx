import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    TextInput,
} from 'react-native'
import ChatItem from './components/ChatItem'
import { PlusIcon } from 'react-native-heroicons/mini'
import { useSelector, useActions } from '@/ui/state/hooks'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Spinner } from '@/ui/components/Spinner'
import { CustomBottomSheet } from '@/ui/components/CustomBottomSheet'
import { NewChatForm } from '@/ui/components/NewChatForm'

export default function HomeScreen() {
    const actions = useActions()
    const initialRender = useRef(true)

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

    const handleCreateNewChat = () => {
        setIsCreatingNewChat(true)
    }

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

                {chats.map((chat, index) => (
                    <ChatItem
                        key={index}
                        title={chat.title}
                        time={chat.timestamp as string}
                        id={chat.id}
                    />
                ))}
            </ScrollView>

            {!isCreatingNewChat && (
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={() => setIsCreatingNewChat(!isCreatingNewChat)}
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
                scrollable={true}
                useModal={true}
                snapPoints={['25%']}
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
})
