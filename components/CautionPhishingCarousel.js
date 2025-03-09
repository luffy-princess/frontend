import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated } from 'react-native';
import responsive from '../scripts/responsive';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CautionPhishingCarousel({ data = {}, renderItem = [], autoScrollInterval = 25000 }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const totalPages = Math.ceil(data.length / 2);

    // Create pages with 2 items each
    const pages = Array.from({ length: totalPages }, (_, pageIndex) =>
        data.slice(pageIndex * 2, (pageIndex + 1) * 2)
    );

    useEffect(() => {
        const timer = setInterval(() => {
            if (data.length > 2) {
                const nextIndex = (currentIndex + 1) % totalPages;
                flatListRef.current?.scrollToIndex({
                    index: nextIndex,
                    animated: true
                });
            }
        }, autoScrollInterval);

        return () => clearInterval(timer);
    }, [currentIndex, data.length, totalPages, autoScrollInterval]);

    const renderPage = ({ item: pageItems }) => (
        <View style={styles.page}>
            {pageItems.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    {renderItem({ item })}
                </View>
            ))}
        </View>
    );

    const onViewableItemsChanged = useRef(({ viewableItems }) => {
        if (viewableItems[0]) {
            setCurrentIndex(viewableItems[0].index);
        }
    }).current;

    const viewabilityConfig = useRef({
        viewAreaCoveragePercentThreshold: 50
    }).current;

    const renderPaginationDots = () => (
        <View style={styles.paginationContainer}>
            {Array.from({ length: totalPages }).map((_, index) => {
                const inputRange = [
                    (index - 1) * SCREEN_WIDTH,
                    index * SCREEN_WIDTH,
                    (index + 1) * SCREEN_WIDTH
                ];

                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [1, 1.5, 1],
                    extrapolate: 'clamp'
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp'
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            {
                                opacity,
                                transform: [{ scale }]
                            }
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <View style={styles.container}>
            <Animated.FlatList
                ref={flatListRef}
                data={pages}
                renderItem={renderPage}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                bounces={false}
                keyExtractor={(_, index) => index.toString()}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                onViewableItemsChanged={onViewableItemsChanged}
                viewabilityConfig={viewabilityConfig}
            />
            {data.length > 2 && renderPaginationDots()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        minHeight: responsive(250),
    },
    page: {
        width: SCREEN_WIDTH,
        flexDirection: 'column',
        gap: responsive(12),
        paddingHorizontal: responsive(20)
    },
    itemContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: responsive(10),
    },
    dot: {
        width: responsive(7),
        height: responsive(7),
        borderRadius: responsive(4),
        backgroundColor: '#1A9AF5',
        marginHorizontal: responsive(4),
    }
});
