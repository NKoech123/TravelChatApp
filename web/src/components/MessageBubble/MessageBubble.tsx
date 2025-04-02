import React from 'react'
import { MessageSchema } from '@nicholas/types'
import { ExpandableTextDisplay } from '../ExpandableTextDisplay'

interface MessageBubbleProps {
    message: MessageSchema
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
    const isAI = message.isAI
    const bubbleClasses = `max-w-[80%] mb-2 ${
        isAI ? 'bg-black text-white' : 'bg-[#F5DFB8]'
    } rounded-lg p-2 shadow-sm font-mono`

    const content = isAI ? (
        <ExpandableTextDisplay>{message.content}</ExpandableTextDisplay>
    ) : (
        message.content
    )

    return (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-4`}>
            <div className={bubbleClasses}>{content}</div>
        </div>
    )
}
