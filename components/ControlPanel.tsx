import React from "react";
import { StyleSheet, View } from "react-native";
import FilterControls from "./FilterControls";
import FrameControls from "./FrameControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/Tabs";

export default function ControlPanel() {
  return (
    <View style={styles.container}>
      <Tabs defaultValue="frame">
        <TabsList>
          <TabsTrigger value="frame">Frame</TabsTrigger>
          <TabsTrigger value="filter">Filter</TabsTrigger>
        </TabsList>

        <View style={styles.contentContainer}>
          <TabsContent value="frame">
            <FrameControls />
          </TabsContent>
          <TabsContent value="filter">
            <FilterControls />
          </TabsContent>
        </View>
      </Tabs>
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
  contentContainer: {
    paddingTop: 20,
    height: 320, // Increased height
  },
});
