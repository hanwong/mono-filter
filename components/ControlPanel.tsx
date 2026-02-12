import Slider from "@react-native-community/slider";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ControlPanelProps {
  onFrameWidthChange: (width: number) => void;
  onFrameColorChange: (color: string) => void;
  onFilterChange: (filter: string) => void;
  onAspectRatioChange: (ratio: number) => void;
}

const FRAME_COLORS = [
  "#FFFFFF",
  "#000000",
  "#F44336",
  "#FFEB3B",
  "#4CAF50",
  "#2196F3",
  "#9C27B0",
];

const FILTERS = ["None", "Sepia", "Grayscale", "Invert", "Warm", "Cool"];

const ASPECT_RATIOS = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 0.8 },
  { label: "16:9", value: 16 / 9 },
  { label: "9:16", value: 9 / 16 },
];

export default function ControlPanel({
  onFrameWidthChange,
  onFrameColorChange,
  onFilterChange,
  onAspectRatioChange,
}: ControlPanelProps) {
  const [activeTab, setActiveTab] = useState<"frame" | "filter">("frame");

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "frame" && styles.activeTab]}
          onPress={() => setActiveTab("frame")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "frame" && styles.activeTabText,
            ]}
          >
            Frame
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "filter" && styles.activeTab]}
          onPress={() => setActiveTab("filter")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "filter" && styles.activeTabText,
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {activeTab === "frame" ? (
          <View>
            <Text style={styles.label}>Frame Width</Text>
            <Slider
              style={{ width: "100%", height: 40 }}
              minimumValue={0}
              maximumValue={50} // 50% max padding
              minimumTrackTintColor="#000000"
              maximumTrackTintColor="#000000"
              onValueChange={onFrameWidthChange}
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
                  onPress={() => onFrameColorChange(color)}
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
                  onPress={() => onAspectRatioChange(ratio.value)}
                >
                  <Text style={styles.ratioText}>{ratio.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        ) : (
          <View>
            <Text style={styles.label}>Select Filter</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {FILTERS.map((filter) => (
                <TouchableOpacity
                  key={filter}
                  style={styles.filterChip}
                  onPress={() => onFilterChange(filter)}
                >
                  <Text>{filter}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabContainer: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  tab: {
    paddingVertical: 10,
    marginRight: 20,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "bold",
  },
  contentContainer: {
    height: 220, // Increased height to accommodate Aspect Ratio controls
  },
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
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
});
