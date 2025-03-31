import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { ChevronRightSvg } from '@/assets/svgs/ChevronRight'
interface ChatItemProps {
    title: string
    time: string
    id: string
}

import { formatDistance } from 'date-fns'

export default function ChatItem({ title, time, id }: ChatItemProps) {
    const formattedTimeDistance = formatDistance(new Date(time), new Date(), {
        addSuffix: true,
    })
    return (
        <TouchableOpacity
            style={styles.container}
            onPress={() => router.push(`/chats/${id}`)}
        >
            <View style={styles.content}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.time}>{formattedTimeDistance}</Text>
            </View>

            <ChevronRightSvg />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#00000033',
    },
    content: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    time: {
        fontSize: 14,
        color: '#999',
    },
})
