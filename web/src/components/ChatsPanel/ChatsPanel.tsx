import React, { useMemo, useState } from 'react'
import { ChatSchema } from '@nicholas/types'
import { useSelector, useActions } from '../../state/hooks'
import { useNavigate } from 'react-router-dom'
import { CreateChatModal } from '../CreateChatModal/CreateChatModal'
import { ChatItem } from './ChatItem'
import { Spinner } from '../Spinner/Spinner'

interface ChatsPanelProps {
    isMobileView: boolean
}

export function ChatsPanel({ isMobileView }: ChatsPanelProps) {
    const actions = useActions()
    const { chatsById, activeChatId, chatsLoading } = useSelector(
        state => state.chats
    )
    const navigate = useNavigate()
    const [showCreateChatModal, setShowCreateChatModal] = useState(false)

    const chats = useMemo(() => {
        return Object.values(chatsById).sort(
            (a, b) =>
                new Date(b.timestamp as string).getTime() -
                new Date(a.timestamp as string).getTime()
        )
    }, [chatsById])

    return (
        <section
            className={`bg-[#faf7f4] flex flex-col h-screen transition-all duration-300 ${isMobileView && activeChatId ? 'hidden' : 'w-full'}`}
        >
            <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-[#faf7f4]">
                <h1 className="text-2xl font-semibold">Chat with me</h1>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="space-y-2 p-4 pb-10">
                    {chatsLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Spinner />
                        </div>
                    ) : (
                        chats.map(chat => (
                            <ChatItem
                                key={chat.id}
                                chat={chat}
                                isActive={activeChatId === chat.id}
                                onClick={() => {
                                    navigate(`/chats/${chat.id}`)
                                    actions.setActiveChatId(chat.id as string)
                                    actions.getMessages(chat.id as string)
                                }}
                                isMobileView={isMobileView}
                            />
                        ))
                    )}
                    {chats.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500">
                                No chats found. Create a new chat to get
                                started.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <div className="sticky bottom-0 z-10 p-4 border-t border-gray-200 bg-[#faf7f4] font-['JetBrains_Mono']">
                <button
                    className="w-full bg-black text-white p-4 rounded-xl font-medium hover:bg-gray-900 transition-colors"
                    onClick={() => setShowCreateChatModal(true)}
                >
                    + CREATE NEW
                </button>
            </div>

            <CreateChatModal
                isOpen={showCreateChatModal}
                onClose={() => setShowCreateChatModal(false)}
            />
        </section>
    )
}

export default ChatsPanel
