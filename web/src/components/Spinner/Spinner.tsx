import React from 'react'

interface SpinnerProps {
    className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '' }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className="w-10 h-10 border-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 rounded-full animate-spin" />
        </div>
    )
}
