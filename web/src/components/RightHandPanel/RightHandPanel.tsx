import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { MessageSchema, ChatSchema } from '@nicholas/types'
import { useSelector, useActions } from '../../state/hooks'
import { Spinner } from '../Spinner/Spinner'
import { ThinkingIndicator } from '../ThinkingIndicator/ThinkingIndicator'
import { MessageBubble } from '../MessageBubble/MessageBubble'
import { useLocation, useNavigate } from 'react-router-dom'

interface RightHandPanelProps {
    isMobileView: boolean
}

export const RightHandPanel: React.FC<RightHandPanelProps> = ({
    isMobileView,
}) => {
    const location = useLocation()
    const navigate = useNavigate()
    const actions = useActions()
    const { activeChatId, chatsById, chipsByChatId, chipsLoading, chipsError } = useSelector(state => state.chats)
    const { messagesLoading, messagesError } = useSelector(
        state => state.messages
    )
    const [isThinking, setIsThinking] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const messagesContainerRef = useRef<HTMLDivElement>(null)

    const pathParts = location.pathname.split('/')
    const chatId = pathParts.length > 2 ? pathParts[2] : null

    const { messagesById } = useSelector(state => state.messages)

    const messages = useMemo(() => {
        return Object.values(messagesById).filter(
            message => message.chatId === activeChatId
        )
    }, [messagesById, activeChatId])

    const chips = useMemo(() => {
        return chipsByChatId[activeChatId as string] || []
    }, [chipsByChatId, activeChatId])


    const [message, setMessage] = useState('')
    const initialRender = useRef(true)

    // Scroll to bottom when component mounts or messages change
    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop =
                messagesContainerRef.current.scrollHeight
        }
    }, [messages, isThinking])



    // Scroll to bottom when new messages are added or AI starts/stops thinking
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages.length, isThinking])

    useEffect(() => {
        if (initialRender.current && chatId) {

            actions.getMessages(chatId as string)
            actions.setActiveChatId(chatId as string)
            initialRender.current = false

        }
    }, [activeChatId, chatId, actions])

    useEffect(() => {
        if (chatId && chips.length === 0) {
            actions.getChips({ chatId: chatId as string })
        }
    }, [chatId])

    useEffect(() => {
        if (messagesError) {
            actions.setActiveChatId('')
            navigate('/')
            console.error(messagesError)
        }
    }, [messagesError])


    const sendMessage = useCallback((message: string) => {
        actions.upsertMessage({
            chatId: activeChatId as string,
            message: {
                isAI: false,
                chatId: activeChatId as string,
                content: message,
            },
            handleSuccess: (messages: MessageSchema[]) => {
                setIsThinking(true)
                // LLM call
                actions.upsertMessage({
                    chatId: activeChatId as string,
                    message: {
                        isAI: true,
                        content: messages[0].content,
                    },
                    handleSuccess: (messages: MessageSchema[]) => {
                        setIsThinking(false)
                        actions.getChips({ chatId: activeChatId as string })
                    },
                })
            },
        })
    }, [activeChatId, actions])


    const handleSendMessage = useCallback((e: React.FormEvent) => {
        if (!message.trim() || !activeChatId) {
            throw new Error('Missing required fields')
        }
        e.preventDefault()
        if (message.trim()) {
            setMessage('')
        }

        sendMessage(message)
    }, [message, activeChatId, sendMessage])

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage(e)
        }
    }, [handleSendMessage])

    // Memoize the chips section to prevent re-renders
    const ChipsSection = useMemo(() => (
        <div className="w-full overflow-x-auto scrollbar-hide pb-4">
            {chipsLoading && chips.length === 0 && <div className="flex items-center gap-2 px-4"><Spinner spinnerSize="5" />Generating Custom Prompts...</div>}
            {chips.length > 0 && <div className="inline-flex space-x-2 px-4">
                {chipsLoading && <Spinner spinnerSize="5" className='mr-2' />} {chips.map((chip, index) => (
                    <div
                        key={index}
                        className="bg-white rounded-lg px-6 py-2 border border-[#C4C7C5] font-normal whitespace-nowrap"
                        role="button"
                        onClick={() => {
                            sendMessage(chip)
                        }}
                    >
                        {chip}
                    </div>
                ))}
            </div>}
        </div>
    ), [chips, chipsLoading, sendMessage])

    return (
        <div
            key={activeChatId}
            className={`flex flex-col h-screen bg-[#faf7f4] transition-all duration-300 ${isMobileView && !activeChatId ? 'hidden' : 'w-full'} font-['JetBrains_Mono']  mx-auto`}
        >
            {messagesLoading ? (
                <Spinner className="h-full" />
            ) : (
                <>
                    {activeChatId ? (
                        <>
                            <div className="sticky top-0 z-10 border-b border-gray-100 p-4 flex-shrink-0">
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            actions.setActiveChatId('')
                                            navigate('/chats')
                                        }}
                                        className="md:hidden"
                                    >
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
                                            chatsById[activeChatId as string]
                                                ?.title
                                        }
                                    </h1>
                                </div>
                            </div>

                            <div
                                ref={messagesContainerRef}
                                className="flex-1 min-h-0 overflow-y-auto px-4 space-y-2 py-4"
                                key={activeChatId}
                            >
                                {messages.map(message => (
                                    <MessageBubble
                                        key={message.id}
                                        message={message}
                                    />
                                ))}
                                {isThinking && <ThinkingIndicator />}
                                {messages.length === 0 && (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        No messages yet
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>


                            <form
                                onSubmit={handleSendMessage}
                                className="flex flex-col items-end gap-2 mt-5"
                            >

                                {ChipsSection}


                                <div className="flex-1 relative w-full">
                                    <textarea
                                        rows={1}
                                        value={message}
                                        onChange={e =>
                                            setMessage(e.target.value)
                                        }
                                        onKeyDown={handleKeyDown}
                                        placeholder="Tell us your travel plans..."
                                        className="w-full p-4 pr-12 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:border-gray-300 resize-none overflow-hidden max-h-32"
                                        style={{ minHeight: '56px' }}
                                    />
                                    <button
                                        type="submit"
                                        className="absolute right-2 top-2 p-2 bg-black rounded-full hover:bg-gray-900 transition-colors disabled:opacity-50"
                                        disabled={
                                            !message.trim() ||
                                            isThinking ||
                                            !activeChatId
                                        }
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

                        </>
                    ) : (
                        <div className="hidden md:flex items-center justify-center h-full text-gray-400">
                            Select a chat to start messaging
                        </div>
                    )}
                </>
            )
            }
        </div >
    )
}

export default RightHandPanel
