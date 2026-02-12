import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  Alert,
  Button,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
// Note: verify if view-shot is needed for saving, but for now placeholder logic

import ControlPanel from "./ControlPanel";
import FrameCanvas from "./FrameCanvas";

const { width } = Dimensions.get("window");

export default function PhotoEditor() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [frameWidth, setFrameWidth] = useState(0); // 0-50 padding percentage
  const [frameColor, setFrameColor] = useState("#FFFFFF");
  const [filterType, setFilterType] = useState("None");
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isControlPanelOpen, setIsControlPanelOpen] = useState(false);

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
      setImageUri(result.assets[0].uri);
    }
  };

  const saveImage = async () => {
    // Placeholder for saving logic
    Alert.alert(
      "Save",
      "Saving logic requires view capture library like react-native-view-shot.",
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Button title="Pick Photo" onPress={pickImage} />
        <Button
          title={isControlPanelOpen ? "Close" : "Edit"}
          onPress={() => setIsControlPanelOpen(!isControlPanelOpen)}
        />
      </View>

      <View style={styles.canvasWrapper}>
        <FrameCanvas
          imageUri={imageUri}
          containerWidth={width - 40} // 20 padding each side
          containerHeight={width - 40} // Square canvas for now
          aspectRatio={aspectRatio}
          frameColor={frameColor}
          frameWidth={frameWidth}
          filterType={filterType}
        />
      </View>

      {isControlPanelOpen && (
        <ControlPanel
          onFrameWidthChange={setFrameWidth}
          onFrameColorChange={setFrameColor}
          onFilterChange={setFilterType}
          onAspectRatioChange={setAspectRatio}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333", // Dark background for editor
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
