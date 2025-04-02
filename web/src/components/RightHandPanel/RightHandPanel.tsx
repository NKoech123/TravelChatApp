import React, { useState, useRef, useEffect } from 'react'

interface Chat {
    id: string
    name: string
    lastMessage: string
    timestamp: string
}

interface MessageSchema {
    id?: string
    content?: string
    isAI?: boolean
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

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto'
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
        }
    }, [message])

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
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

    const messages: MessageSchema[] = Array.from({ length: 20 }, (_, i) => ({
        id: `${i + 1}`,
        content: i % 2 === 0 ? 'This is user message' : 'This is AI message',
        isAI: i % 2 !== 0,
    }))

    return (
        <section
            className={`flex flex-col h-screen bg-white transition-all duration-300 ${isMobileView && !activeChat ? 'hidden' : 'w-full'}`}
        >
            {activeChat ? (
                <>
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
                            <h1 className="text-2xl font-semibold">
                                {
                                    chats.find(chat => chat.id === activeChat)
                                        ?.name
                                }
                            </h1>
                        </div>
                    </div>

                    <div className="flex-1 min-h-0 overflow-y-auto px-4 space-y-4 py-4">
                        {messages.map(message => (
                            <div
                                key={message.id}
                                className={`flex ${message.isAI ? 'justify-start' : 'justify-end'} mb-4`}
                            >
                                <div
                                    className={`max-w-[80%] mb-2 ${message.isAI ? 'bg-[#f8f4ee]' : 'bg-black text-white'} rounded-lg p-3 shadow-sm`}
                                >
                                    {message.content}
                                </div>
                            </div>
                        ))}
                    </div>

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
                                    className="absolute right-2 top-2 p-2 bg-black rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50"
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
        </section>
    )
}

export default RightHandPanel
