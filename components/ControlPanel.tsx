import { useAtom } from "jotai";
import React, { useEffect } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { editorStateAtom } from "../store/atoms";
import FilterControls from "./FilterControls";
import FrameControls from "./FrameControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function ControlPanel() {
  const [state, setState] = useAtom(editorStateAtom);
  const { isControlPanelOpen } = state;

  const translateY = useSharedValue(0);

  useEffect(() => {
    if (isControlPanelOpen) {
      translateY.value = withTiming(0, { duration: 300 });
    } else {
      translateY.value = withTiming(210, { duration: 300 });
    }
  }, [isControlPanelOpen]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const togglePanel = () => {
    setState((prev) => ({
      ...prev,
      isControlPanelOpen: !prev.isControlPanelOpen,
    }));
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <TouchableOpacity activeOpacity={1} onPress={togglePanel}>
        <View style={styles.handleContainer}>
          <View style={styles.handle} />
        </View>
      </TouchableOpacity>

      <Tabs defaultValue="frame">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => !isControlPanelOpen && togglePanel()}
        >
          <TabsList>
            <TabsTrigger value="frame">Frame</TabsTrigger>
            <TabsTrigger value="filter">Filter</TabsTrigger>
          </TabsList>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <TabsContent value="frame">
            <FrameControls />
          </TabsContent>
          <TabsContent value="filter">
            <FilterControls />
          </TabsContent>
        </View>
      </Tabs>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)", // Slightly more opaque
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
    paddingBottom: 20, // Extra padding for safe area
  },
  handleContainer: {
    alignItems: "center",
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
  },
  contentContainer: {
    paddingTop: 10,
    height: 160,
  },
});
