import React, { useState, useEffect, useRef, useMemo } from 'react'
import { RightHandPanel, ChatsPanel } from './components'
import { useSelector, useActions } from './state/hooks'
import { ChatSchema } from '@nicholas/types'
import { Provider } from 'react-redux'
import { store } from './state/store'

interface Chat {
    id: string
    name: string
    lastMessage: string
    timestamp: string
}

export function App() {
    const actions = useActions()
    const initialRender = useRef(true)

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

    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

    useEffect(() => {
        if (initialRender.current) {
            actions.getChats()
            initialRender.current = false
        }
    }, [])

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



    return (
        <Provider store={store}>
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
        </Provider>
    )
}

export default App
