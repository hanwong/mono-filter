import {
  Canvas,
  ColorMatrix,
  Group,
  Image,
  Rect,
  RuntimeShader,
  Skia,
  useImage,
} from "@shopify/react-native-skia";
import { useAtomValue } from "jotai";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import { GRAIN_SHADER, VIGNETTE_SHADER } from "../constants/shaders";
import { editorStateAtom } from "../store/atoms";

interface FrameCanvasProps {
  containerWidth: number;
  containerHeight: number;
}

const FILTERS: { [key: string]: number[] } = {
  None: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
  Sepia: [
    0.393, 0.769, 0.189, 0, 0, 0.349, 0.686, 0.168, 0, 0, 0.272, 0.534, 0.131,
    0, 0, 0, 0, 0, 1, 0,
  ],
  Grayscale: [
    0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152, 0.0722, 0, 0, 0.2126, 0.7152,
    0.0722, 0, 0, 0, 0, 0, 1, 0,
  ],
  Invert: [-1, 0, 0, 0, 1, 0, -1, 0, 0, 1, 0, 0, -1, 0, 1, 0, 0, 0, 1, 0],
  Warm: [1.06, 0, 0, 0, 0, 0, 1.01, 0, 0, 0, 0, 0, 0.93, 0, 0, 0, 0, 0, 1, 0],
  Cool: [0.95, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1.08, 0, 0, 0, 0, 0, 1, 0],
};

export default function FrameCanvas({
  containerWidth,
  containerHeight,
}: FrameCanvasProps) {
  const state = useAtomValue(editorStateAtom);
  const {
    imageUri,
    frameColor,
    frameWidth,
    aspectRatio,
    filterType,
    backgroundColor,
    grain: grainStrength,
    vignette: vignetteStrength,
  } = state;

  const skiaImage = useImage(imageUri || "");

  // Pre-compile shaders (Must be before any early return)
  const grainEffect = useMemo(() => Skia.RuntimeEffect.Make(GRAIN_SHADER), []);
  const vignetteEffect = useMemo(
    () => Skia.RuntimeEffect.Make(VIGNETTE_SHADER),
    [],
  );

  // Shared Values for Gestures
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const savedTranslationX = useSharedValue(0);
  const savedTranslationY = useSharedValue(0);
  const isPinching = useSharedValue(false);
  const startFocalX = useSharedValue(0);
  const startFocalY = useSharedValue(0);

  // Gesture Definitions
  const panGesture = Gesture.Pan()
    .maxPointers(1) // Single finger pan only
    .onStart(() => {
      if (isPinching.value) return;
      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    })
    .onUpdate((e) => {
      if (isPinching.value) return;
      translationX.value = savedTranslationX.value + e.translationX;
      translationY.value = savedTranslationY.value + e.translationY;
    });

  const pinchGesture = Gesture.Pinch()
    .onStart((e) => {
      isPinching.value = true;
      savedScale.value = scale.value;

      // Calculate the start focal point in the image's coordinate space
      // focalX/Y are screen coordinates relative to the view
      startFocalX.value = e.focalX;
      startFocalY.value = e.focalY;

      savedTranslationX.value = translationX.value;
      savedTranslationY.value = translationY.value;
    })
    .onUpdate((e) => {
      if (e.numberOfPointers < 2) return;
      scale.value = savedScale.value * e.scale;

      // Calculate how much the focal point should move to stay under fingers
      // New Image Coordinate = (Screen Coordinate - Translation) / Scale

      // We want the point under the finger (e.focal) to remain the same point on the image
      // (startFocal - savedTranslation) / savedScale === (e.focal - newTranslation) / scale

      // Therefore:
      // newTranslation = e.focal - scale * ((startFocal - savedTranslation) / savedScale)

      const focalX = e.focalX;
      const focalY = e.focalY;

      // The point on the image we started pinching at
      const pointX =
        (startFocalX.value - savedTranslationX.value) / savedScale.value;
      const pointY =
        (startFocalY.value - savedTranslationY.value) / savedScale.value;

      translationX.value = focalX - scale.value * pointX;
      translationY.value = focalY - scale.value * pointY;
    })
    .onEnd(() => {
      isPinching.value = false;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  // Derived transform for Skia Image
  const transform = useDerivedValue(() => {
    return [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { scale: scale.value },
    ];
  });

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

  // 1. Determine Frame Size and Position (Centered in Container)
  let frameDisplayWidth = containerWidth;
  let frameDisplayHeight = containerWidth / aspectRatio;

  if (frameDisplayHeight > containerHeight) {
    frameDisplayHeight = containerHeight;
    frameDisplayWidth = containerHeight * aspectRatio;
  }

  const frameX = (containerWidth - frameDisplayWidth) / 2;
  const frameY = (containerHeight - frameDisplayHeight) / 2;

  // 2. Calculate Image Size (Inner Box)
  const minDimension = Math.min(frameDisplayWidth, frameDisplayHeight);
  const paddingPx = (minDimension * frameWidth) / 100;

  const imageX = frameX + paddingPx;
  const imageY = frameY + paddingPx;
  const imageW = Math.max(0, frameDisplayWidth - paddingPx * 2);
  const imageH = Math.max(0, frameDisplayHeight - paddingPx * 2);

  // 3. Calculate Image Render Dimensions (Fill Width)
  let renderX = imageX;
  let renderY = imageY;
  let renderW = imageW;
  let renderH = imageH;

  if (skiaImage) {
    const imgW = skiaImage.width();
    const imgH = skiaImage.height();
    const imgAspectRatio = imgW / imgH;

    // Fill Width Strategy
    renderW = imageW;
    renderH = renderW / imgAspectRatio;

    // Center Vertically
    renderY = imageY + (imageH - renderH) / 2;
  }

  return (
    <View style={{ width: containerWidth, height: containerHeight }}>
      <GestureDetector gesture={composedGesture}>
        <Animated.View style={{ flex: 1 }}>
          <Canvas style={{ flex: 1 }}>
            {/* Draw Frame Background */}
            <Rect
              x={frameX}
              y={frameY}
              width={frameDisplayWidth}
              height={frameDisplayHeight}
              color={frameColor}
            />

            {/* Draw Image Content with Clipping */}
            <Group
              clip={{ x: imageX, y: imageY, width: imageW, height: imageH }}
            >
              {/* Background behind the image (seen if transparent image or loading) */}
              <Rect
                x={imageX}
                y={imageY}
                width={imageW}
                height={imageH}
                color={backgroundColor}
              />

              {skiaImage && (
                <Image
                  image={skiaImage}
                  x={renderX}
                  y={renderY}
                  width={renderW}
                  height={renderH}
                  fit="fill"
                  transform={transform}
                >
                  {FILTERS[filterType] && (
                    <ColorMatrix matrix={FILTERS[filterType]} />
                  )}
                </Image>
              )}

              {/* Grain Layer */}
              {grainStrength > 0 && grainEffect && (
                <Rect
                  x={imageX}
                  y={imageY}
                  width={imageW}
                  height={imageH}
                  blendMode="overlay"
                >
                  <RuntimeShader
                    source={grainEffect}
                    uniforms={{
                      intensity: grainStrength,
                    }}
                  />
                </Rect>
              )}

              {/* Vignette Layer */}
              {vignetteStrength > 0 && vignetteEffect && (
                <Rect
                  x={imageX}
                  y={imageY}
                  width={imageW}
                  height={imageH}
                  blendMode="srcOver"
                >
                  <RuntimeShader
                    source={vignetteEffect}
                    uniforms={{
                      resolution: [imageW, imageH],
                      intensity: vignetteStrength,
                    }}
                  />
                </Rect>
              )}
            </Group>
          </Canvas>
        </Animated.View>
      </GestureDetector>
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
