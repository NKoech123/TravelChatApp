import React, { useState, useRef, useEffect } from 'react'

interface Chat {
    id: string
    name: string
    lastMessage: string
    timestamp: string
}

interface MessageSchema {
    object?: string
    error?: string
    id?: string
    content?: string
    isAI?: boolean
    chatId?: string
    userId?: string
    timestamp?: string
}

interface RightHandPanelProps {
    activeChat: string | null
    isMobileView: boolean
    onBackClick: () => void
    chats: Chat[]
}

export function RightHandPanel({
    activeChat,
    isMobileView,
    onBackClick,
    chats,
}: RightHandPanelProps) {
    const [message, setMessage] = useState('')
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [message])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            // Handle sending message here
            setMessage('')
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto'
            }
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }


    const messages: MessageSchema[] = [
        {
            id: '1',
            content: 'Hello, how are you?',
            isAI: false,
        },
        {
            id: '2',
            content: 'I am fine, thank you!',
            isAI: true,
        },
        {
            id: '3',
            content: 'What is your name?',
            isAI: false,
        },
        {
            id: '4',
            content: 'I am a chatbot.',
            isAI: true,
        },
        {
            id: '5',
            content: 'What is your name?',
            isAI: false,
        },
        {
            id: '6',
            content: 'I am a chatbot.',
            isAI: true,
        },
        {
            id: '7',
            content: 'What is your name?',
            isAI: false,
        },

    ]



    return (
        <div
            className={`flex flex-col h-screen bg-white transition-all duration-300 ${isMobileView && !activeChat ? 'hidden' : 'w-full'
                } md:block relative`}
        >
            {activeChat ? (
                <>
                    {/* Chat Header */}
                    <div className="sticky top-0 z-10 border-b border-gray-100 p-4 flex-shrink-0 bg-white">
                        <div className="flex items-center gap-3">
                            <button onClick={onBackClick} className="md:hidden">
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15 19l-7-7 7-7"
                                    />
                                </svg>
                            </button>
                            <h2 className="text-xl font-semibold">
                                {chats.find(chat => chat.id === activeChat)?.name}
                            </h2>
                        </div>
                    </div>

                    {/* Chat Messages Container */}
                    <div className="flex-1 pb-[88px]">
                        <div className="space-y-4 p-4">
                            {messages.map(message => (
                                <div key={message.id} className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-4`}>
                                    <div className={`max-w-[80%] mb-2 ${message.isAI ? 'bg-[#f8f4ee]' : 'bg-black text-white'} rounded-lg p-3 shadow-sm`}>
                                        {message.content}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Fixed Message Input */}
                    <div className="sticky bottom-0 left-0 right-0 border-t border-gray-100 p-4 bg-white">
                        <form
                            onSubmit={handleSendMessage}
                            className="flex items-end gap-2"
                        >
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    rows={1}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Tell us your travel plans..."
                                    className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-300 resize-none overflow-hidden max-h-32"
                                    style={{ minHeight: '56px' }}
                                />
                                <button
                                    type="submit"
                                    className="absolute right-2 top-2 p-2 bg-black rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!message.trim()}
                                >
                                    <svg
                                        className="w-5 h-5 text-white transform rotate-180"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </>
            ) : (
                <div className="hidden md:flex items-center justify-center h-full text-gray-400">
                    Select a chat to start messaging
                </div>
            )}
        </div>
    )
}

export default RightHandPanel
