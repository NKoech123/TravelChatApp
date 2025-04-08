import React from 'react'

interface SpinnerProps {
    className?: string
    spinnerSize?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', spinnerSize = '10' }) => {
    return (
        <div className={`flex items-center justify-center ${className}`}>
            <div className={`w-${spinnerSize || '10'} h-${spinnerSize || '10'} border-4 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900 rounded-full animate-spin`} />
        </div>
    )
}
