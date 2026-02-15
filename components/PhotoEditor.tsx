import { Ionicons } from "@expo/vector-icons";
import { useImage } from "@shopify/react-native-skia";
import { File as ExpoFile, Paths } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useAtom, useSetAtom } from "jotai";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      setImageWithReset(result.assets[0].uri);
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

  const saveImage = async () => {
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
        filterType: state.filterType,
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
      </View>

      <View style={styles.canvasWrapper} pointerEvents="box-none">
        <View style={styles.shadowContainer} pointerEvents="box-none">
          <View ref={viewRef} collapsable={false} pointerEvents="box-none">
            <FrameCanvas
              containerWidth={canvasWidth}
              containerHeight={canvasHeight}
            />
          </View>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 10,
    zIndex: 10,
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(128, 128, 128, 0.1)", // Subtle background for touch target
  },
  canvasWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 48,
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
