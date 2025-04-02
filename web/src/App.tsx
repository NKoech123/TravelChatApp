import React, { useState } from 'react'
import { RightHandPanel, ChatsPanel } from './components'


interface Chat {
    id: string
    name: string
    lastMessage: string
    timestamp: string
}

export function App() {
    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

    React.useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768)
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleBackClick = () => {
        setActiveChat(null)
    }

    const chats: Chat[] = [
        {
            id: '1',
            name: 'Lumbumbashi',
            lastMessage: 'Are there any rivers in here?',
            timestamp: '4 days ago',
        },
        {
            id: '2',
            name: 'New York Travel',
            lastMessage: 'How is the weather?',
            timestamp: '4 days ago',
        },
        {
            id: '3',
            name: 'San Diego Chat',
            lastMessage: 'Best beaches?',
            timestamp: '4 days ago',
        },
        {
            id: '4',
            name: 'Berkeley Cal',
            lastMessage: 'Campus tour',
            timestamp: '4 days ago',
        },
        {
            id: '5',
            name: 'Kisumu, Kenya',
            lastMessage: 'Local cuisine',
            timestamp: '4 days ago',
        },
        {
            id: '6',
            name: 'Osaka, Japan',
            lastMessage: 'Temple visits',
            timestamp: '5 days ago',
        },
        {
            id: '7',
            name: 'Gweru, Zimbabwe',
            lastMessage: 'Safari tours',
            timestamp: '5 days ago',
        },
        {
            id: '8',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '9',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '10',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '11',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '12',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '13',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '14',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
        {
            id: '15',
            name: 'Kampala, Uganda',
            lastMessage: 'Local cuisine',
            timestamp: '5 days ago',
        },
    ]

    return (

        <div
            className={`md:grid md:grid-cols-[400px,1fr] h-screen ${isMobileView ? 'flex' : ''}`}
        >
            <ChatsPanel
                chats={chats}
                activeChat={activeChat}
                isMobileView={isMobileView}
                onChatSelect={setActiveChat}
            />

            <RightHandPanel
                activeChat={activeChat}
                isMobileView={isMobileView}
                onBackClick={handleBackClick}
                chats={chats}
            />
        </div>

    )
}

export default App
