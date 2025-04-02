import { FC, useState } from 'react'
import {
    TouchableOpacity,
    View,
    Text,
    TextInput,
    StyleSheet,
    ActivityIndicator,
    Platform,
    KeyboardAvoidingView,
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

    const resetFormData = () => {
        setFormData({
            title: '',
            description: '',
        })
    }

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
                resetFormData()
            },
        })
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            style={styles.keyboardAvoidingView}
        >
            <View style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.formTitle}>Create New Chat</Text>
                    <TextInput
                        placeholder="Type name of the chat"
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
                            setFormData(prev => ({
                                ...prev,
                                description: text,
                            }))
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
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
        backgroundColor: '#FDF8EF',
    },
    container: {
        flex: 1,
        backgroundColor: '#FDF8EF',
    },
    formContainer: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#00000015',
        marginHorizontal: 16,
        marginTop: 16,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginBottom: 24,
        color: '#000',
        textAlign: 'center',
    },
    inputField: {
        borderWidth: 0,
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        fontSize: 16,
        backgroundColor: '#F5F5F5',
        color: '#000',
    },
    inputError: {
        borderColor: '#FF3B30',
        backgroundColor: '#FFF5F5',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        gap: 12,
    },
    button: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButton: {
        backgroundColor: '#000',
    },
    disabledButton: {
        backgroundColor: '#E0E0E0',
    },
    cancelButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#000',
    },
    saveButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    cancelButtonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
    disabledText: {
        opacity: 0.5,
    },
})
