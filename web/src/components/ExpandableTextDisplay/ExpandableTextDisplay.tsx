import React, { useState, useEffect, useRef, FC, ReactNode } from 'react'
import classNames from 'classnames'

interface ExpandableTextDisplayProps {
    maxLines?: number
    children: ReactNode
    className?: string
}

const DEFAULT_LINE_LIMIT = 7

export const ExpandableTextDisplay: FC<ExpandableTextDisplayProps> = ({
    maxLines,
    children,
    className,
}) => {
    const contentRef = useRef<HTMLDivElement>(null)

    const [expanded, setExpanded] = useState(false)
    const [showButton, setShowButton] = useState(false)

    useEffect(() => {
        const checkHeight = () => {
            if (contentRef.current) {
                const fullHeight = contentRef.current.scrollHeight
                const clampedHeight =
                    parseInt(
                        getComputedStyle(contentRef.current).lineHeight,
                        10
                    ) * (maxLines || DEFAULT_LINE_LIMIT)
                setShowButton(fullHeight > clampedHeight)
            }
        }

        checkHeight()
        window.addEventListener('resize', checkHeight)

        return () => {
            window.removeEventListener('resize', checkHeight)
        }
    }, [children])

    return (
        <div className={classNames('my-2', className)}>
            <div
                ref={contentRef}
                style={{
                    marginTop: '0.5rem',
                    overflow: expanded ? 'visible' : 'hidden',
                    display: expanded ? 'block' : '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: expanded
                        ? 'none'
                        : maxLines || DEFAULT_LINE_LIMIT,
                }}
            >
                {children}
            </div>
            {showButton && (
                <button
                    onClick={event => {
                        event.stopPropagation()
                        setExpanded(!expanded)
                    }}
                    className="text-[#faf7f4] font-bold"
                >
                    {expanded ? 'Show less' : 'Show more'}
                </button>
            )}
        </div>
    )
}
