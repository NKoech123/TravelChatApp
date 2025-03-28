import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, TextStyle, ViewStyle, LayoutChangeEvent } from 'react-native';

interface TruncatedTextProps {
    text: string;
    maxLines?: number;
    style?: TextStyle;
    containerStyle?: ViewStyle;
    showMoreText?: string;
    showLessText?: string;
    showMoreStyle?: TextStyle;
    onExpand?: (isExpanded: boolean) => void;
}

export const TruncatedText: React.FC<TruncatedTextProps> = ({
    text,
    maxLines = 3,
    style,
    containerStyle,
    showMoreText = 'Show more',
    showLessText = 'Show less',
    showMoreStyle = { color: '#F5E6D3', fontWeight: 'bold', paddingTop: 2 },
    onExpand,
}) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTruncated, setIsTruncated] = useState(false);
    const [measuredHeight, setMeasuredHeight] = useState(0);
    const [truncatedHeight, setTruncatedHeight] = useState(0);

    const toggleExpanded = () => {
        setIsExpanded(!isExpanded);
        onExpand?.(!isExpanded);
    };

    const onFullTextLayout = (e: LayoutChangeEvent) => {
        const fullHeight = e.nativeEvent.layout.height;
        setMeasuredHeight(fullHeight);
    };

    const onTruncatedTextLayout = (e: LayoutChangeEvent) => {
        const currentHeight = e.nativeEvent.layout.height;
        setTruncatedHeight(currentHeight);
    };

    useEffect(() => {
        if (truncatedHeight > 0 && measuredHeight > 0) {
            const shouldTruncate = measuredHeight > truncatedHeight;
            setIsTruncated(shouldTruncate);
        }
    }, [measuredHeight, truncatedHeight]);

    return (
        <View style={containerStyle}>
            {/* Hidden full text measurement */}
            <Text
                style={[style, { position: 'absolute', opacity: 0, width: '100%' }]}
                onLayout={onFullTextLayout}
            >
                {text}
            </Text>

            {/* Visible text */}
            <Text
                style={style}
                numberOfLines={isExpanded ? undefined : maxLines}
                onLayout={onTruncatedTextLayout}
            >
                {text}
            </Text>

            {(isTruncated || isExpanded) && (
                <TouchableOpacity
                    onPress={toggleExpanded}
                    activeOpacity={0.7}
                >
                    <Text style={showMoreStyle}>
                        {isExpanded ? showLessText : showMoreText}
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}; 