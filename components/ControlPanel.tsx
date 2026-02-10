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

export default function ControlPanel({
  onFrameWidthChange,
  onFrameColorChange,
  onFilterChange,
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
    height: 150, // Fixed height for control panel content
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 10,
    marginTop: 10,
  },
  colorScroll: {
    flexDirection: "row",
  },
  colorChip: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
});
