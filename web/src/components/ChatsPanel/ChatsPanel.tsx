import React from 'react'

interface Chat {
    id: string
    name: string
    lastMessage: string
    timestamp: string
}

interface ChatsPanelProps {
    chats: Chat[]
    activeChat: string | null
    isMobileView: boolean
    onChatSelect: (chatId: string) => void
}

export function ChatsPanel({
    chats,
    activeChat,
    isMobileView,
    onChatSelect,
}: ChatsPanelProps) {
    return (
        <div
            className={`bg-[#faf7f4] flex flex-col h-screen transition-all duration-300 ${isMobileView && activeChat ? 'hidden' : 'w-full'
                } md:block`}
        >
            {/* Fixed Header */}
            <div className="sticky top-0 z-10 p-4 border-b border-gray-200 bg-[#faf7f4]">
                <h1 className="text-2xl font-semibold">Chat with me</h1>
            </div>

            {/* Main container with padding for fixed button */}
            <div className="flex-1 min-h-0">
                {/* Scrollable chat list */}
                <div className="h-full overflow-y-auto">
                    <div className="space-y-2 p-4 pb-10">
                        {chats.map(chat => (
                            <div
                                key={chat.id}
                                onClick={() => onChatSelect(chat.id)}
                                className={`p-4 bg-white rounded-2xl cursor-pointer transition-colors hover:bg-gray-50 ${activeChat === chat.id ? 'shadow-sm ring-1 ring-gray-200' : ''
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">{chat.name}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400">
                                            {chat.timestamp}
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
            </div>

            {/* Fixed create button */}
            <div className="sticky bottom-0 z-10 p-4 border-t border-gray-200 bg-[#faf7f4]">
                <button className="w-full bg-black text-white p-4 rounded-xl font-medium hover:bg-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    + CREATE NEW
                </button>
            </div>
        </div>
    )
}

export default ChatsPanel
