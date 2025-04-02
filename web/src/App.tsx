import React, { useState, useEffect, useRef } from 'react'
import { RightHandPanel, ChatsPanel } from './components'
import { useSelector, useActions } from './state/hooks'
import { Routes, Route, Navigate } from 'react-router-dom'

export function App() {
    const actions = useActions()
    const initialRender = useRef(true)

    const { chatsError } = useSelector(state => state.chats)

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
            className={`font-['Work_Sans'] md:grid md:grid-cols-[400px,1fr] h-screen bg-[#faf7f4]  overflow-hidden ${isMobileView ? 'flex' : ''}`}
        >
            <ChatsPanel isMobileView={isMobileView} />
            <RightHandPanel isMobileView={isMobileView} />
        </div>
    )
}

export default App
