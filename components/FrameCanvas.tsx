import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface FrameCanvasProps {
  imageUri: string | null;
  containerWidth: number;
  containerHeight: number;
  frameColor: string;
  frameWidth: number; // 0 to 50 representing percentage of padding
  aspectRatio: number; // e.g., 1 (Square), 4/5, 9/16
  filterType: string;
}

export default function FrameCanvas({
  imageUri,
  containerWidth,
  containerHeight,
  frameColor,
  frameWidth,
  aspectRatio,
  filterType,
}: FrameCanvasProps) {
  // Shared Values for Gestures
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);

  // Gesture Definitions
  const panGesture = Gesture.Pan()
    .onStart(() => {
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    })
    .onUpdate((e) => {
      translationX.value = savedTranslationX.value + e.translationX;
      translationY.value = savedTranslationY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      savedScale.value = scale.value;
    })
    .onUpdate((e) => {
      scale.value = savedScale.value * e.scale;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ],
  }));

  if (!imageUri) {
    return (
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            height: containerHeight,
            backgroundColor: "#eee",
          },
        ]}
      />
    );
  }

  // 1. Determine Frame Size (Outer Box)
  let frameDisplayWidth = containerWidth;
  let frameDisplayHeight = containerWidth / aspectRatio;

  if (frameDisplayHeight > containerHeight) {
    frameDisplayHeight = containerHeight;
    frameDisplayWidth = containerHeight * aspectRatio;
  }

  // 2. Calculate Image Size (Inner Box)
  const minDimension = Math.min(frameDisplayWidth, frameDisplayHeight);
  const paddingPx = (minDimension * frameWidth) / 100;

  const finalImageWidth = Math.max(0, frameDisplayWidth - paddingPx * 2);
  const finalImageHeight = Math.max(0, frameDisplayHeight - paddingPx * 2);

  // Filter Logic
  const getFilterStyle = (type: string) => {
    switch (type) {
      case "Sepia":
        return { backgroundColor: "#704214", opacity: 0.3 };
      case "Warm":
        return { backgroundColor: "#ff9900", opacity: 0.2 };
      case "Cool":
        return { backgroundColor: "#0099ff", opacity: 0.2 };
      case "Grayscale":
        return { backgroundColor: "#333333", opacity: 0.5 };
      case "Invert":
        return { backgroundColor: "#fff", opacity: 0.1 };
      default:
        return null;
    }
  };

  const filterStyle = getFilterStyle(filterType);

  return (
    <View
      style={[
        styles.centerContent,
        {
          width: containerWidth,
          height: containerHeight,
          backgroundColor: "transparent",
        },
      ]}
    >
      {/* The Frame Background */}
      <View
        style={{
          width: frameDisplayWidth,
          height: frameDisplayHeight,
          backgroundColor: frameColor,
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden", // Outer container clips everything
        }}
      >
        {/* Clipping View for Image */}
        <View
          style={{
            width: finalImageWidth,
            height: finalImageHeight,
            overflow: "hidden", // This clips the image to the inner frame
            backgroundColor: "#000", // Optional: placeholder color
          }}
        >
          <GestureDetector gesture={composedGesture}>
            <Animated.View
              style={[
                {
                  width: finalImageWidth,
                  height: finalImageHeight,
                },
                animatedStyle,
              ]}
            >
              {/* The Image */}
              <Image
                source={{ uri: imageUri }}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="cover"
              />

              {/* Filter Overlay */}
              {filterStyle && (
                <View
                  style={[StyleSheet.absoluteFill, filterStyle]}
                  pointerEvents="none"
                />
              )}
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});
