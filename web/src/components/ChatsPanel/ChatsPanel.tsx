import React, { useMemo } from 'react'
import { ChatSchema } from '@nicholas/types'
import { useSelector, useActions } from '../../state/hooks'
import { formatDistance } from 'date-fns'



interface ChatsPanelProps {
    isMobileView: boolean

}

export function ChatsPanel({

    isMobileView,

}: ChatsPanelProps) {
    const actions = useActions()
    const { chatsById, activeChatId } = useSelector(
        state => state.chats
    )

    const chats = useMemo(() => {
        return Object.values(chatsById).sort(
            (a, b) =>
                new Date(b.timestamp as string).getTime() -
                new Date(a.timestamp as string).getTime()
        )
    }, [chatsById])

    return (
        <section
            className={`bg-[#faf7f4] flex flex-col h-screen transition-all duration-300 ${isMobileView && activeChat ? 'hidden' : 'w-full'}`}
        >
            <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-[#faf7f4]">
                <h1 className="text-2xl font-semibold">Chat with me</h1>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
                <div className="space-y-2 p-4 pb-10">
                    {chats.map(chat => (
                        <div
                            role="button"
                            key={chat.id}
                            onClick={() => actions.setActiveChatId(chat.id as string)}
                            className={`p-4 bg-white rounded-2xl cursor-pointer transition-colors hover:bg-gray-50 ${activeChatId === chat.id ? 'shadow-sm ring-1 ring-gray-200' : ''}`}
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{chat.title}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-400">
                                        {formatDistance(new Date(chat.timestamp as string), new Date(), {
                                            addSuffix: true,
                                        })}
                                    </span>
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="sticky bottom-0 z-10 p-4 border-t border-gray-200 bg-[#faf7f4]">
                <button className="w-full bg-black text-white p-4 rounded-xl font-medium hover:bg-gray-900 transition-colors">
                    + CREATE NEW
                </button>
            </div>
        </section>
    )
}

export default ChatsPanel
