import React, { useState, useEffect } from 'react'
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

    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleBackClick = () => {
        setActiveChat(null)
    }

    const chats: Chat[] = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Chat ${i + 1}`,
        lastMessage: 'Sample message...',
        timestamp: '4 days ago',
    }))

    return (
        <div
            className={`md:grid md:grid-cols-[400px,1fr] h-screen overflow-hidden ${isMobileView ? 'flex' : ''}`}
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
