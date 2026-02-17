import { Ionicons } from "@expo/vector-icons";
import { useImage } from "@shopify/react-native-skia";
import Constants, { ExecutionEnvironment } from "expo-constants";
import { File as ExpoFile, Paths } from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useAtom, useSetAtom } from "jotai";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Svg, { Rect, Text as SvgText } from "react-native-svg";
import { editorStateAtom, setImageWithResetAtom } from "../store/atoms";
import { renderOffscreen } from "../utils/offscreenRender";
import ControlPanel from "./ControlPanel";
import FrameCanvas from "./FrameCanvas";

export default function PhotoEditor() {
  const [state] = useAtom(editorStateAtom);
  const { imageUri } = state;

  const setImageWithReset = useSetAtom(setImageWithResetAtom);

  const viewRef = useRef<View>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();
  const skiaImage = useImage(imageUri || "");
  const [saving, setSaving] = useState(false);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Sorry, we need camera roll permissions to make this work!",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const pickedUri = result.assets[0].uri;
      // Convert to JPEG (Skia can't decode HEIC) + generate small thumbnail for previews
      const [fullImage, thumbnail] = await Promise.all([
        ImageManipulator.manipulateAsync(pickedUri, [], {
          compress: 1,
          format: ImageManipulator.SaveFormat.JPEG,
        }),
        ImageManipulator.manipulateAsync(
          pickedUri,
          [{ resize: { width: 200 } }],
          { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG },
        ),
      ]);
      setImageWithReset({
        uri: fullImage.uri,
        thumbnailUri: thumbnail.uri,
      });
    }
  };

  const themeContainerStyle = styles.lightContainer;
  const iconColor = "#000000";

  const { width, height } = Dimensions.get("window");

  // Adaptive Sizing Logic
  const MAX_WIDTH = width - 20;
  const MAX_HEIGHT = height * 0.75;

  let canvasWidth = MAX_WIDTH;
  let canvasHeight = canvasWidth / state.aspectRatio;

  if (canvasHeight > MAX_HEIGHT) {
    canvasHeight = MAX_HEIGHT;
    canvasWidth = canvasHeight * state.aspectRatio;
  }

  /* AdMob Logic */
  const [interstitial, setInterstitial] = useState<any>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  const [isAdMobAvailable, setIsAdMobAvailable] = useState(false);

  useEffect(() => {
    let ad: any = null;
    let unsubscribeLoaded: any = null;
    let unsubscribeClosed: any = null;

    const initAdMob = async () => {
      try {
        // Skip AdMob in Expo Go to avoid crash
        if (
          Constants.executionEnvironment === ExecutionEnvironment.StoreClient
        ) {
          console.log("AdMob skipped in Expo Go");
          setIsAdMobAvailable(false);
          return;
        }

        // Dynamic import to avoid crash in Expo Go

        const {
          InterstitialAd,
          AdEventType,
          TestIds,
        } = require("react-native-google-mobile-ads");
        setIsAdMobAvailable(true);

        // Determine Ad Unit ID based on platform
        let adUnitId = TestIds.INTERSTITIAL;

        if (Platform.OS === "ios") {
          adUnitId =
            process.env.EXPO_PUBLIC_ADMOB_IOS_INTERSTITIAL_ID ||
            TestIds.INTERSTITIAL;
        } else if (Platform.OS === "android") {
          adUnitId =
            process.env.EXPO_PUBLIC_ADMOB_ANDROID_INTERSTITIAL_ID ||
            TestIds.INTERSTITIAL;
        }

        if (adUnitId && adUnitId.includes("xxxxxxxx")) {
          console.warn(
            "AdMob: Using TestIds because env vars contain placeholders",
          );
          adUnitId = TestIds.INTERSTITIAL;
        }

        ad = InterstitialAd.createForAdRequest(adUnitId, {
          requestNonPersonalizedAdsOnly: true,
        });

        unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
          setAdLoaded(true);
        });

        unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
          setAdLoaded(false);
          setInterstitial(null);
          // Reload ad
          ad.load();
        });

        ad.load();
        setInterstitial(ad);
      } catch (error) {
        console.warn("AdMob not available (likely running in Expo Go):", error);
        setIsAdMobAvailable(false);
      }
    };

    initAdMob();

    return () => {
      if (unsubscribeLoaded) unsubscribeLoaded();
      if (unsubscribeClosed) unsubscribeClosed();
    };
  }, []);

  const processSaveImage = async () => {
    if (!imageUri || !skiaImage) return;

    try {
      if (permissionResponse?.status !== "granted") {
        const { status } = await requestPermission();
        if (status !== "granted") {
          Alert.alert(
            "Permission needed",
            "We need permission to save the image.",
          );
          return;
        }
      }

      setSaving(true);

      // Small delay to let the loading UI render
      await new Promise((r) => setTimeout(r, 50));

      // Render at original image resolution using Skia offscreen surface
      const bytes = renderOffscreen({
        image: skiaImage,
        aspectRatio: state.aspectRatio,
        frameWidth: state.frameWidth,
        frameColor: state.frameColor,
        backgroundColor: state.backgroundColor,
        filterMatrix: state.filterMatrix,
        grain: state.grain,
        vignette: state.vignette,
      });

      if (!bytes) {
        setSaving(false);
        Alert.alert("Error", "Failed to render the image.");
        return;
      }

      // Write PNG bytes to temp file and save to media library
      const file = new ExpoFile(Paths.cache, "mono-filter-export.png");
      file.write(bytes);

      await MediaLibrary.saveToLibraryAsync(file.uri);

      setSaving(false);

      const imgW = skiaImage.width();
      Alert.alert(
        "Saved!",
        `Image saved at original resolution (${imgW}px wide).`,
      );
    } catch (e) {
      setSaving(false);
      console.log(e);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  const saveImage = async () => {
    if (isAdMobAvailable && adLoaded && interstitial) {
      interstitial.show();
    } else {
      processSaveImage();
    }
  };

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
          <Ionicons name="images-outline" size={28} color={iconColor} />
        </TouchableOpacity>
        {imageUri && (
          <TouchableOpacity onPress={saveImage} style={styles.iconButton}>
            <Ionicons name="download-outline" size={28} color={iconColor} />
          </TouchableOpacity>
        )}
        {/* Logo centered on screen */}
        <View style={styles.logoCentered} pointerEvents="none">
          <Svg width={150} height={40} viewBox="0 0 240 80">
            {/* Outer thin black border */}
            <Rect
              x={2}
              y={2}
              width={236}
              height={76}
              fill="none"
              stroke="#000"
              strokeWidth={4}
            />
            {/* Black fill with white frame gap */}
            <Rect x={9} y={9} width={222} height={62} fill="#000" />
            <SvgText
              x={120}
              y={54}
              textAnchor="middle"
              fontFamily="Helvetica Neue"
              fontSize={38}
              fontWeight="800"
              letterSpacing={0.5}
              fill="#fff"
            >
              Mono.F.F
            </SvgText>
          </Svg>
        </View>
      </View>

      <View style={styles.canvasWrapper} pointerEvents="box-none">
        {imageUri ? (
          <View style={styles.shadowContainer} pointerEvents="box-none">
            <View ref={viewRef} collapsable={false} pointerEvents="box-none">
              <FrameCanvas
                containerWidth={canvasWidth}
                containerHeight={canvasHeight}
              />
            </View>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.placeholder}
            onPress={pickImage}
            activeOpacity={0.6}
          >
            <Ionicons name="camera-outline" size={48} color="#ccc" />
            <Text style={styles.placeholderText}>Select a photo</Text>
            <Text style={styles.placeholderSub}>
              Add custom frames and apply{"\n"}film-inspired filters to your
              photos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {imageUri && <ControlPanel />}

      {/* Full-screen loading overlay */}
      <Modal visible={saving} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Saving...</Text>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#ffffff",
  },
  darkContainer: {
    backgroundColor: "#ffffff", // Verified request: "Change app background to white"
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  logoCentered: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 10,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
  },
  canvasWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 48,
  },
  placeholder: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#aaa",
  },
  placeholderSub: {
    fontSize: 13,
    color: "#ccc",
    textAlign: "center",
    lineHeight: 20,
  },
  shadowContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
    backgroundColor: "#fff", // Need bg for shadow to cast properly off the element?
    // Actually FrameCanvas draws the frame color.
    // But for the shadow to look like it's coming from the frame,
    // the shadow path usually follows the opaqueness.
    // If FrameCanvas is a rect, it should be fine.
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: 16,
    marginTop: 12,
    fontWeight: "500",
  },
});
