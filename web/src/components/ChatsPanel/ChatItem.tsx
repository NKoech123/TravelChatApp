import React from 'react'
import { ChatSchema } from '@nicholas/types'
import { formatDistance } from 'date-fns'
import classNames from 'classnames'

interface ChatItemProps {
    chat: ChatSchema
    isActive: boolean
    onClick: () => void
    isMobileView: boolean
}

export function ChatItem({ chat, isActive, onClick, isMobileView }: ChatItemProps) {
    return (
        <div
            role="button"
            onClick={onClick}
            className={classNames(
                'p-4 bg-white rounded-lg border border-[#00000033] cursor-pointer transition-colors hover:bg-gray-50',
                {
                    'shadow-sm ring-1 ring-gray-200': isActive,
                }
            )}
        >
            <div className="flex flex-row justify-between md:items-center gap-1 md:gap-2">
                <div className="flex flex-col">
                    <span className="font-medium">
                        {chat.title}
                    </span>
                    <span className="text-sm text-gray-400">
                        {formatDistance(
                            new Date(chat.timestamp as string),
                            new Date(),
                            {
                                addSuffix: true,
                            }
                        )}
                    </span>

                </div>
                <div className="flex items-center gap-2">

                    <svg
                        className="w-6 h-10 md:w-5 md:h-5 text-gray-400"
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
    )
}

export default ChatItem 