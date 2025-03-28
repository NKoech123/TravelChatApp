import React, { useCallback, useEffect, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Platform,
    Dimensions,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetScrollView,
    BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface CustomBottomSheetProps {
    visible: boolean
    onClose: () => void
    title?: string
    hideTitle?: boolean
    children: React.ReactNode
    snapPoints?: (string | number)[]
    enablePanDownToClose?: boolean
    showDragHandle?: boolean
    enableContentPanningGesture?: boolean
    scrollable?: boolean
    useModal?: boolean
}

export const CustomBottomSheet = ({
    visible,
    onClose,
    title,
    hideTitle = false,
    children,
    snapPoints = ['70%', '90%'],
    enablePanDownToClose = true,
    showDragHandle = true,
    enableContentPanningGesture = true,
    scrollable = false,
    useModal = false,
}: CustomBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null)
    const { height: screenHeight } = Dimensions.get('window')
    const insets = useSafeAreaInsets()

    const bottomSpacing = Platform.OS === 'ios' ? insets.bottom : 0

    const processedSnapPoints = snapPoints.map(point =>
        typeof point === 'string' ? point : Math.min(point, screenHeight - 50)
    )

    const renderBackdrop = useCallback(
        props => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.7}
                pressBehavior="close"
            />
        ),
        []
    )

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand()
        } else {
            bottomSheetRef.current?.close()
        }
    }, [visible])

    const handleSheetChanges = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose()
            }
        },
        [onClose]
    )

    const Content = scrollable ? BottomSheetScrollView : BottomSheetView

    return (
        <View style={styles.container}>
            <BottomSheet
                ref={bottomSheetRef}
                index={-1}
                snapPoints={processedSnapPoints}
                enablePanDownToClose={enablePanDownToClose}
                backdropComponent={renderBackdrop}
                handleIndicatorStyle={styles.indicator}
                handleComponent={showDragHandle ? undefined : () => null}
                onChange={handleSheetChanges}
                enableContentPanningGesture={enableContentPanningGesture}
                style={styles.bottomSheet}
                backgroundStyle={styles.bottomSheetBackground}
                keyboardBehavior="extend"
                android_keyboardInputMode="adjustResize"
                enableOverDrag={true}
            >
                <Content style={styles.contentContainer}>
                    {title && !hideTitle && (
                        <View style={styles.header}>
                            <Text style={styles.headerTitle}>{title}</Text>
                            <TouchableOpacity
                                onPress={onClose}
                                style={styles.closeButton}
                                accessibilityLabel="Close"
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={styles.childrenContainer}>{children}</View>
                </Content>
            </BottomSheet>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'box-none',
        zIndex: 9999,
    },
    contentContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FDF8EF',
    },
    childrenContainer: {
        flex: 1,
        paddingBottom: Platform.OS === 'ios' ? 50 : 30,
    },
    bottomSheet: {
        zIndex: 9999,
    },
    bottomSheetBackground: {
        backgroundColor: 'white',
    },
    indicator: {
        width: 36,
        height: 4,
        backgroundColor: '#E4E4E6',
        borderRadius: 2,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1F1F32',
    },
    closeButton: {
        padding: 8,
        borderRadius: 20,
    },
})

export default CustomBottomSheet
