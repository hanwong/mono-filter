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

const FILTERS = ["None", "Sepia", "Grayscale", "Invert", "Warm", "Cool"];

export default function FilterControls() {
  const [state, setState] = useAtom(editorStateAtom);
  const {
    filterType: selectedFilter,
    grain: currentGrain,
    vignette: currentVignette,
  } = state;

  return (
    <View>
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
              setState((prev) => ({ ...prev, filterType: filter }))
            }
          >
            <Text
              style={[selectedFilter === filter && styles.activeFilterText]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedFilter !== "None" && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.label}>Grain</Text>
          <Slider
            key="grain-slider"
            containerStyle={{ width: "100%", height: 40 }}
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
            containerStyle={{ width: "100%", height: 40 }}
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
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  activeFilterChip: {
    backgroundColor: "#000",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
