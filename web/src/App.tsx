import React, { useState, useEffect, useRef, useMemo } from 'react'
import { RightHandPanel, ChatsPanel } from './components'
import { useSelector, useActions } from './state/hooks'
import { ChatSchema } from '@nicholas/types'



export function App() {
    const actions = useActions()
    const initialRender = useRef(true)

    const { chatsLoading, chatsError } = useSelector(
        state => state.chats
    )

    const [activeChat, setActiveChat] = useState<string | null>(null)
    const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768)

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
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])



    return (
        <div
            className={`md:grid md:grid-cols-[400px,1fr] h-screen overflow-hidden ${isMobileView ? 'flex' : ''}`}
        >
            <ChatsPanel
                isMobileView={isMobileView}

            />
            <RightHandPanel
                isMobileView={isMobileView}


            />
        </div>
    )
}

export default App
