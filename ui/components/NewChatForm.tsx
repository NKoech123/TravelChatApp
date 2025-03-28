import { FC, useState } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
} from 'react-native'
import { ChatInputSchema, ChatSchema, ChatsSchema } from '@nicholas/types'
import { useActions, useSelector } from '@/ui/state/hooks'

interface NewChatFormProps {
    closeModal: () => void
}

interface FormData {
    title: string
    description: string
}

export const NewChatForm: FC<NewChatFormProps> = ({ closeModal }) => {
    const actions = useActions()

    const { chatsLoading } = useSelector(state => state.chats)

    const [formData, setFormData] = useState<FormData>({
        title: '',
        description: '',
    })

    const isFormValid = formData.title.trim().length > 0

    const handleCreateChat = async () => {
        if (!isFormValid) return

        actions.upsertChat({
            chats: {
                chats: [
                    {
                        title: formData.title.trim(),
                        description: formData.description.trim(),
                    },
                ],
            },
            handleSuccess: () => {
                closeModal()
            },
        })
    }

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create New Chat</Text>
            <TextInput
                placeholder="Name..."
                style={[
                    styles.inputField,
                    !isFormValid &&
                        formData.title.length > 0 &&
                        styles.inputError,
                ]}
                placeholderTextColor="#666"
                value={formData.title}
                onChangeText={text =>
                    setFormData(prev => ({ ...prev, title: text }))
                }
                editable={!chatsLoading}
            />

            <TextInput
                placeholder="Description of the chat"
                style={[styles.inputField, styles.textArea]}
                multiline={true}
                numberOfLines={3}
                placeholderTextColor="#666"
                value={formData.description}
                onChangeText={text =>
                    setFormData(prev => ({ ...prev, description: text }))
                }
                editable={!chatsLoading}
            />
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[styles.button, styles.cancelButton]}
                    onPress={closeModal}
                    disabled={chatsLoading}
                >
                    <Text
                        style={[
                            styles.cancelButtonText,
                            chatsLoading && styles.disabledText,
                        ]}
                    >
                        Cancel
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.saveButton,
                        !isFormValid && styles.disabledButton,
                    ]}
                    disabled={!isFormValid || chatsLoading}
                    onPress={handleCreateChat}
                >
                    {chatsLoading ? (
                        <ActivityIndicator color="white" size="small" />
                    ) : (
                        <Text style={styles.saveButtonText}>Save</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
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
    inputError: {
        borderColor: '#FF3B30',
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
    disabledButton: {
        backgroundColor: '#999',
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
    disabledText: {
        opacity: 0.5,
    },
})
