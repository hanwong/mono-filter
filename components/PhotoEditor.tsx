import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { StatusBar } from "expo-status-bar";
import { useAtom, useSetAtom } from "jotai";
import React, { useRef } from "react";
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import { captureRef } from "react-native-view-shot";

import { editorStateAtom, setImageWithResetAtom } from "../store/atoms";
import ControlPanel from "./ControlPanel";
import FrameCanvas from "./FrameCanvas";

const { width } = Dimensions.get("window");

export default function PhotoEditor() {
  const [state, setState] = useAtom(editorStateAtom);
  const { imageUri, isControlPanelOpen } = state;

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
  const themeContainerStyle =
    colorScheme === "light" ? styles.lightContainer : styles.darkContainer;

  return (
    <SafeAreaView style={[styles.container, themeContainerStyle]}>
      <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
      <View style={styles.header}>
        <Button title="Pick Photo" onPress={pickImage} />
        {imageUri && <Button title="Save" onPress={saveImage} />}
        <Button
          title={isControlPanelOpen ? "Close" : "Edit"}
          onPress={() =>
            setState((prev) => ({
              ...prev,
              isControlPanelOpen: !prev.isControlPanelOpen,
            }))
          }
        />
      </View>

      <View style={styles.canvasWrapper}>
        <View ref={viewRef} collapsable={false}>
          <FrameCanvas
            containerWidth={width - 40} // 20 padding each side
            containerHeight={width - 40} // Square canvas for now
          />
        </View>
      </View>

      {isControlPanelOpen && <ControlPanel />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lightContainer: {
    backgroundColor: "#fff",
  },
  darkContainer: {
    backgroundColor: "#333",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    zIndex: 10,
  },
  canvasWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
