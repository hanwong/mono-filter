import { Slider } from "@miblanchard/react-native-slider";
import { useAtom } from "jotai";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { editorStateAtom } from "../store/atoms";

// Trendy Colors 2024/2025
const FRAME_COLORS = [
  "#FFFFFF", // White
  "#000000", // Black
  "#F5F5F7", // Off-White
  "#E5E0D5", // Beige
  "#333333", // Charcoal
  "#C07A60", // Terracotta
  "#8DA399", // Sage Green
  "#7698B3", // Muted Blue
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

const ASPECT_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 0.8 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
];

export default function FrameControls() {
  const [state, setState] = useAtom(editorStateAtom);
  const { frameWidth: currentFrameWidth } = state;

  return (
    <View>
      <Text style={styles.label}>Frame Width {" " + currentFrameWidth}</Text>
      <Slider
        key="frame-width-slider"
        containerStyle={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={50} // 50% max padding
        step={1}
        value={currentFrameWidth}
        minimumTrackTintColor="#000000"
        maximumTrackTintColor="#000000"
        onValueChange={(val) =>
          setState((prev) => ({ ...prev, frameWidth: val[0] }))
        }
      />

      <Text style={styles.label}>Frame Color</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorScroll}
      >
        {FRAME_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorChip, { backgroundColor: color }]}
            onPress={() => setState((prev) => ({ ...prev, frameColor: color }))}
          />
        ))}
      </ScrollView>

      <Text style={styles.label}>Background Color</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.colorScroll}
      >
        {BACKGROUND_COLORS.map((color) => (
          <TouchableOpacity
            key={color}
            style={[styles.colorChip, { backgroundColor: color }]}
            onPress={() =>
              setState((prev) => ({ ...prev, backgroundColor: color }))
            }
          />
        ))}
      </ScrollView>

      <Text style={styles.label}>Aspect Ratio</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.ratioScroll}
      >
        {ASPECT_RATIOS.map((ratio) => (
          <TouchableOpacity
            key={ratio.label}
            style={styles.ratioChip}
            onPress={() =>
              setState((prev) => ({ ...prev, aspectRatio: ratio.value }))
            }
          >
            <Text style={styles.ratioText}>{ratio.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  colorScroll: {
    flexDirection: "row",
    marginBottom: 10,
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  ratioScroll: {
    flexDirection: "row",
    marginBottom: 10,
  },
  ratioChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  ratioText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
