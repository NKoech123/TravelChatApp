import { View, Text, TouchableOpacity } from 'react-native'
import { Stack, useLocalSearchParams, router } from 'expo-router'
import { ChatScreen } from '@/ui/screens'
import { ChevronLeftIcon } from 'react-native-heroicons/mini'
import { useSelector } from '@/ui/state/hooks'

export default function ChatPage() {
    const { id } = useLocalSearchParams()
    const { chatsById } = useSelector(state => state.chats)
    return (
        <View>
            <Stack.Screen
                options={{
                    headerTitle: () => (
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: 'JetBrainsMono',
                            }}
                        >
                            {chatsById[id as string]?.title || 'Chat Room'}
                        </Text>
                    ),
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                            <ChevronLeftIcon size={30} color="#000000" />
                        </TouchableOpacity>
                    ),
                }}
                name="chat"
            />
            <ChatScreen id={id as string} />
        </View>
    )
}
