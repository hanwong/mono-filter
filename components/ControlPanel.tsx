import { BlurView } from "expo-blur";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FilterControls from "./FilterControls";
import FrameControls from "./FrameControls";

type TabType = "frame" | "filter";

const DRAWER_HEIGHT = 200;

export default function ControlPanel() {
  const [activeTab, setActiveTab] = useState<TabType | null>(null);
  const drawerHeight = useSharedValue(0);

  const toggleTab = (tab: TabType) => {
    if (activeTab === tab) {
      setActiveTab(null);
      drawerHeight.value = withTiming(0, { duration: 250 });
    } else {
      setActiveTab(tab);
      drawerHeight.value = withTiming(DRAWER_HEIGHT, { duration: 250 });
    }
  };

  const drawerStyle = useAnimatedStyle(() => ({
    height: drawerHeight.value,
    overflow: "hidden" as const,
  }));

  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      {/* Drawer content with blur background */}
      <Animated.View style={[styles.drawer, drawerStyle]}>
        <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
        <View style={styles.drawerInner}>
          {activeTab === "frame" && <FrameControls />}
          {activeTab === "filter" && <FilterControls />}
        </View>
      </Animated.View>

      {/* Bottom bar buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "frame" && styles.tabButtonActive,
          ]}
          onPress={() => toggleTab("frame")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "frame" && styles.tabButtonTextActive,
            ]}
          >
            Frame
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            styles.tabButtonRight,
            activeTab === "filter" && styles.tabButtonActive,
          ]}
          onPress={() => toggleTab("filter")}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.tabButtonText,
              activeTab === "filter" && styles.tabButtonTextActive,
            ]}
          >
            Filter
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  drawer: {
    backgroundColor: "#ffffffdc",
  },
  drawerInner: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  buttonRow: {
    flexDirection: "row",
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
  },
  tabButtonRight: {
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
  },
  tabButtonActive: {
    backgroundColor: "#000000",
    borderTopColor: "#000000",
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000000",
  },
  tabButtonTextActive: {
    color: "#ffffff",
  },
});
