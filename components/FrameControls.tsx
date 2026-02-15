import { Ionicons } from "@expo/vector-icons";
import { Slider } from "@miblanchard/react-native-slider";
import { useAtom } from "jotai";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { editorStateAtom } from "../store/atoms";
import ScrollableContainer from "./ui/ScrollableContainer";

// Trendy Colors 2024/2025
const FRAME_COLORS = [
  "#FFFFFF", // White
  "#000000", // Black
  "#F5F5F7", // Off-White
  "#E5E0D5", // Beige
  "#333333", // Charcoal
  "#C07A60", // Terracotta
  "#8DA399", // Sage Green
];

const BACKGROUND_COLORS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#F5F5F7", // Off-White
  "#D1D1D1", // Light Grey
  "#5B6E85", // Slate Blue
  "#D8A8A8", // Dusty Pink
  "#8A9A5B", // Olive/Sage
];

const VERTICAL_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "3:4", value: 3 / 4 },
  { label: "2:3", value: 2 / 3 },
  { label: "9:16", value: 9 / 16 },
];

const HORIZONTAL_RATIOS = [
  { label: "5:4", value: 5 / 4 },
  { label: "4:3", value: 4 / 3 },
  { label: "3:2", value: 3 / 2 },
  { label: "16:9", value: 16 / 9 },
];

type ColorTarget = "frameColor" | "backgroundColor" | null;

export default function FrameControls() {
  const [state, setState] = useAtom(editorStateAtom);
  const {
    frameWidth: currentFrameWidth,
    aspectRatio: currentRatio,
    frameColor: currentFrameColor,
    backgroundColor: currentBgColor,
  } = state;

  const [pickerTarget, setPickerTarget] = useState<ColorTarget>(null);
  const [pickerColor, setPickerColor] = useState("#FFFFFF");

  const openPicker = (target: ColorTarget) => {
    const currentColor =
      target === "frameColor" ? currentFrameColor : currentBgColor;
    setPickerColor(currentColor);
    setPickerTarget(target);
  };

  const confirmColor = () => {
    if (pickerTarget) {
      setState((prev) => ({ ...prev, [pickerTarget]: pickerColor }));
    }
    setPickerTarget(null);
  };

  const setRatio = (value: number) => {
    setState((prev) => ({ ...prev, aspectRatio: value }));
  };

  const isActive = (value: number) => Math.abs(currentRatio - value) < 0.001;

  const renderRatioChip = (ratio: { label: string; value: number }) => (
    <TouchableOpacity
      key={ratio.label}
      style={[
        styles.ratioChip,
        isActive(ratio.value) && styles.ratioChipActive,
      ]}
      onPress={() => setRatio(ratio.value)}
    >
      <Text
        style={[
          styles.ratioText,
          isActive(ratio.value) && styles.ratioTextActive,
        ]}
      >
        {ratio.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <ScrollableContainer
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Aspect Ratio — two rows */}
        <Text style={styles.label}>Ratio</Text>
        <View style={styles.ratioSection}>
          <View style={styles.ratioRow}>
            <Ionicons
              name="phone-portrait-outline"
              size={16}
              color="#999"
              style={{ marginRight: 8 }}
            />
            {VERTICAL_RATIOS.map(renderRatioChip)}
          </View>
          <View style={styles.ratioRow}>
            <Ionicons
              name="phone-landscape-outline"
              size={16}
              color="#999"
              style={{ marginRight: 8 }}
            />
            {HORIZONTAL_RATIOS.map(renderRatioChip)}
          </View>
        </View>

        <Text style={styles.label}>Width {" " + currentFrameWidth}</Text>
        <Slider
          key="frame-width-slider"
          containerStyle={{ width: "100%", height: 30 }}
          minimumValue={0}
          maximumValue={50}
          step={1}
          value={currentFrameWidth}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#000000"
          onValueChange={(val) =>
            setState((prev) => ({ ...prev, frameWidth: val[0] }))
          }
        />

        <Text style={styles.label}>Color</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorScroll}
        >
          {FRAME_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorChip,
                { backgroundColor: color },
                currentFrameColor === color && styles.colorChipActive,
              ]}
              onPress={() =>
                setState((prev) => ({ ...prev, frameColor: color }))
              }
            />
          ))}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => openPicker("frameColor")}
          >
            <Ionicons name="color-palette-outline" size={16} color="#666" />
          </TouchableOpacity>
        </ScrollView>

        <Text style={styles.label}>BG</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.colorScroll}
        >
          {BACKGROUND_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorChip,
                { backgroundColor: color },
                currentBgColor === color && styles.colorChipActive,
              ]}
              onPress={() =>
                setState((prev) => ({ ...prev, backgroundColor: color }))
              }
            />
          ))}
          <TouchableOpacity
            style={styles.pickerButton}
            onPress={() => openPicker("backgroundColor")}
          >
            <Ionicons name="color-palette-outline" size={16} color="#666" />
          </TouchableOpacity>
        </ScrollView>
        <View style={{ height: 20 }} />
      </ScrollableContainer>

      {/* Color Picker Modal — wheel color picker (pure JS) */}
      <Modal
        visible={pickerTarget !== null}
        transparent
        animationType="fade"
        onRequestClose={() => setPickerTarget(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {pickerTarget === "frameColor"
                ? "Frame Color"
                : "Background Color"}
            </Text>

            <View style={styles.pickerContainer}>
              <ColorPicker
                color={pickerColor}
                onColorChangeComplete={(color: string) => setPickerColor(color)}
                thumbSize={30}
                sliderSize={20}
                noSnap={true}
                row={false}
                swatches={false}
                useNativeDriver={false}
                useNativeLayout={false}
              />
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPickerTarget(null)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmColor}
              >
                <Text style={styles.confirmButtonText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
    marginTop: 5,
    color: "#333",
  },
  ratioSection: {
    marginBottom: 5,
  },
  ratioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratioChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    marginRight: 6,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  ratioChipActive: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  ratioText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#333",
  },
  ratioTextActive: {
    color: "#fff",
  },
  colorScroll: {
    flexDirection: "row",
    marginBottom: 5,
  },
  colorChip: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  colorChipActive: {
    borderColor: "#000000",
  },
  pickerButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  pickerContainer: {
    width: 260,
    height: 260,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#000",
    alignItems: "center",
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
