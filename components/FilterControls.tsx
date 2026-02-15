import { Slider } from "@miblanchard/react-native-slider";
import { useAtom } from "jotai";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { editorStateAtom } from "../store/atoms";
import ScrollableContainer from "./ui/ScrollableContainer";

const FILTERS = [
  "None",
  "Sepia",
  "Grayscale",
  "Film BW",
  "Invert",
  "Warm",
  "Cool",
];

export default function FilterControls() {
  const [state, setState] = useAtom(editorStateAtom);
  const {
    filterType: selectedFilter,
    grain: currentGrain,
    vignette: currentVignette,
  } = state;

  return (
    <ScrollableContainer
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.label}>Select Filter</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterChip,
              selectedFilter === filter && styles.activeFilterChip,
            ]}
            onPress={() =>
              setState((prev) => ({
                ...prev,
                filterType: filter,
                ...(filter === "None" ? { grain: 0, vignette: 0 } : {}),
              }))
            }
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedFilter !== "None" && (
        <View style={{ marginTop: 10 }}>
          <Text style={styles.label}>Grain</Text>
          <Slider
            key="grain-slider"
            containerStyle={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={currentGrain}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onValueChange={(val) =>
              setState((prev) => ({ ...prev, grain: val[0] }))
            }
          />

          <Text style={styles.label}>Vignette</Text>
          <Slider
            key="vignette-slider"
            containerStyle={{ width: "100%", height: 30 }}
            minimumValue={0}
            maximumValue={1}
            step={0.05}
            value={currentVignette}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onValueChange={(val) =>
              setState((prev) => ({ ...prev, vignette: val[0] }))
            }
          />
        </View>
      )}
      <View style={{ height: 20 }} />
    </ScrollableContainer>
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
    color: "#333", // Dark text
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    backgroundColor: "#f5f5f5",
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeFilterChip: {
    backgroundColor: "#000",
    borderColor: "#000",
  },
  filterText: {
    fontSize: 11,
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
