import React, { useState, useEffect } from 'react'

export const ThinkingIndicator: React.FC = () => {
    const [dots, setDots] = useState('')

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => (prev.length >= 3 ? '' : prev + '.'))
        }, 500)

        return () => clearInterval(interval)
    }, [])

    return (
        <div className="mb-4 max-w-[50%] self-start relative">
            <div className="bg-black bg-opacity-70 py-3 px-4 rounded-3xl rounded-bl-none ml-1 relative">
                <p className="text-white text-base font-mono leading-6">
                    AI is thinking{dots}
                </p>
            </div>
        </div>
    )
}
