import React from "react";
import { Image, StyleSheet, View } from "react-native";

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
  // Logic: Fit within container while maintaining aspectRatio
  let frameDisplayWidth = containerWidth;
  let frameDisplayHeight = containerWidth / aspectRatio;

  if (frameDisplayHeight > containerHeight) {
    frameDisplayHeight = containerHeight;
    frameDisplayWidth = containerHeight * aspectRatio;
  }

  // 2. Calculate Image Size (Inner Box)
  // frameWidth is % of min dimension
  const minDimension = Math.min(frameDisplayWidth, frameDisplayHeight);
  const padding = (minDimension * frameWidth) / 100; // Total padding budget
  // Note: frameWidth is 0-50, so max padding is 50% of dimension (which means 0 size image)
  // Actually padding should be applied to both sides?
  // If frameWidth is 10, does it mean 10% border on each side? Or 10% total reduction?
  // Let's assume frameWidth is percentage of the dimension that is border.
  // Example: frameWidth 10 => 10% border thickness relative to minDimension?
  // Let's stick to: image size = dimension - (dimension * frameWidth / 100 * 2)
  // No, let's use straightforward pixel padding calculation based on % of minDimension.
  // Padding per side = (minDimension * frameWidth / 100)

  const paddingPx = (minDimension * frameWidth) / 100;

  const imageDisplayWidth = frameDisplayWidth - paddingPx * 2;
  const imageDisplayHeight = frameDisplayHeight - paddingPx * 2;

  // Ensure dimensions are positive
  const finalImageWidth = Math.max(0, imageDisplayWidth);
  const finalImageHeight = Math.max(0, imageDisplayHeight);

  // Filter Logic (Simple Overlay)
  const getFilterStyle = (type: string) => {
    switch (type) {
      case "Sepia":
        return { backgroundColor: "#704214", opacity: 0.3 };
      case "Warm":
        return { backgroundColor: "#ff9900", opacity: 0.2 };
      case "Cool":
        return { backgroundColor: "#0099ff", opacity: 0.2 };
      case "Grayscale":
        return { backgroundColor: "#333333", opacity: 0.5 }; // Poor man's grayscale
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
          overflow: "hidden", // Ensure image doesn't bleed out
        }}
      >
        {/* The Image */}
        <Image
          source={{ uri: imageUri }}
          style={{
            width: finalImageWidth,
            height: finalImageHeight,
          }}
          resizeMode="cover" // Use cover because we calculated exact dimensions
        />

        {/* Filter Overlay on Image Only */}
        {filterStyle && (
          <View
            style={{
              position: "absolute",
              width: finalImageWidth,
              height: finalImageHeight,
              ...filterStyle,
            }}
            pointerEvents="none"
          />
        )}
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
