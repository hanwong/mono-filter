import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useAtom, useSetAtom } from "jotai";
import React, { useRef } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import { editorStateAtom, setImageWithResetAtom } from "../store/atoms";
import ControlPanel from "./ControlPanel";
import FrameCanvas from "./FrameCanvas";

export default function PhotoEditor() {
  const [state, setState] = useAtom(editorStateAtom);
  const { imageUri } = state;

  const setImageWithReset = useSetAtom(setImageWithResetAtom);

  const viewRef = useRef<View>(null);
  const [permissionResponse, requestPermission] = MediaLibrary.usePermissions();

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

  const saveImage = async () => {
    if (!imageUri) return;

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

      const localUri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        Alert.alert("Saved!", "Your image has been saved to the gallery.");
      }
    } catch (e) {
      console.log(e);
      Alert.alert("Error", "Failed to save the image.");
    }
  };

  const colorScheme = useColorScheme();
  const themeContainerStyle = styles.lightContainer; // Force light theme container
  const iconColor = "#000000"; // Force black icons

  const { width, height } = Dimensions.get("window");

  // Adaptive Sizing Logic
  const MAX_WIDTH = width - 20; // 10px padding on each side (tighter)
  const MAX_HEIGHT = height * 0.75; // Uses more vertical space

  let canvasWidth = MAX_WIDTH;
  let canvasHeight = canvasWidth / state.aspectRatio;

  // If height exceeds max allowed (e.g. portrait), scale down to fit height
  if (canvasHeight > MAX_HEIGHT) {
    canvasHeight = MAX_HEIGHT;
    canvasWidth = canvasHeight * state.aspectRatio;
  }

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

      <View style={styles.canvasWrapper}>
        <View style={styles.shadowContainer}>
          <View ref={viewRef} collapsable={false}>
            <FrameCanvas
              containerWidth={canvasWidth}
              containerHeight={canvasHeight}
            />
          </View>
        </View>
      </View>

      {imageUri && (
        <View style={styles.controlPanelOverlay}>
          <ControlPanel />
        </View>
      )}
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
    // Ensure background is transparent or matches so shadow looks good
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
  controlPanelOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
});
