import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface ScrollableContainerProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  showsVerticalScrollIndicator?: boolean;
}

export default function ScrollableContainer({
  children,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
}: ScrollableContainerProps) {
  const [contentHeight, setContentHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  const opacity = useSharedValue(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    // Check if we are at the bottom
    const isCloseToBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    // Show indicator if NOT at bottom and there IS scrollable content
    const shouldShow =
      contentSize.height > layoutMeasurement.height && !isCloseToBottom;

    opacity.value = withTiming(shouldShow ? 1 : 0);
  };

  const onLayout = (e: LayoutChangeEvent) => {
    setContainerHeight(e.nativeEvent.layout.height);
    checkScrollability(contentHeight, e.nativeEvent.layout.height);
  };

  const onContentSizeChange = (w: number, h: number) => {
    setContentHeight(h);
    checkScrollability(h, containerHeight);
  };

  const checkScrollability = (contentH: number, containerH: number) => {
    // Initial check - if content > container, show indicator
    if (contentH > containerH) {
      opacity.value = withTiming(1);
    } else {
      opacity.value = withTiming(0);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <View style={[styles.wrapper, style]} onLayout={onLayout}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[contentContainerStyle, { paddingBottom: 30 }]}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={showsVerticalScrollIndicator}
        onContentSizeChange={onContentSizeChange}
      >
        {children}
      </ScrollView>

      {/* Scroll Indicator */}
      <Animated.View
        style={[styles.indicatorContainer, animatedStyle]}
        pointerEvents="none"
      >
        <Ionicons name="chevron-down" size={20} color="#000" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    position: "relative",
  },
  scrollView: {
    flex: 1,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: -20,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
