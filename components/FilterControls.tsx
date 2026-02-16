import {
  Canvas,
  ColorMatrix,
  Image as SkiaImage,
  useImage,
  type SkImage,
} from "@shopify/react-native-skia";
import { useAtom } from "jotai";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  TouchableOpacity as GHTouchable,
  ScrollView,
} from "react-native-gesture-handler";
import {
  FILTER_NAMES,
  IDENTITY,
  getFilterGroup,
  type FilterVariant,
} from "../constants/filters";
import { editorStateAtom } from "../store/atoms";
import ScrollableContainer from "./ui/ScrollableContainer";

const THUMB_SIZE = 72;

// Thumbnail preview — receives a shared SkImage to avoid multiple loads
const FilterThumb = React.memo(function FilterThumb({
  variant,
  thumbImage,
  isSelected,
  onPress,
}: {
  variant: FilterVariant;
  thumbImage: SkImage;
  isSelected: boolean;
  onPress: () => void;
}) {
  return (
    <GHTouchable
      style={[styles.thumbWrap, isSelected && styles.thumbActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Canvas style={styles.thumbCanvas}>
        <SkiaImage
          image={thumbImage}
          x={0}
          y={0}
          width={THUMB_SIZE}
          height={THUMB_SIZE}
          fit="cover"
        >
          <ColorMatrix matrix={variant.matrix} />
        </SkiaImage>
      </Canvas>
      <Text
        style={[styles.thumbLabel, isSelected && styles.thumbLabelActive]}
        numberOfLines={1}
      >
        {variant.name}
      </Text>
    </GHTouchable>
  );
});

export default function FilterControls() {
  const [state, setState] = useAtom(editorStateAtom);
  const {
    filterType: selectedFilter,
    filterVariantIndex: selectedIdx,
    thumbnailUri,
  } = state;

  // Load thumbnail image ONCE — shared across all FilterThumb instances
  const thumbImage = useImage(thumbnailUri || "");

  const selectCategory = (name: string) => {
    if (name === "None") {
      setState((prev) => ({
        ...prev,
        filterType: "None",
        filterVariantIndex: 0,
        filterMatrix: IDENTITY,
      }));
      return;
    }
    const group = getFilterGroup(name);
    if (!group) return;
    setState((prev) => ({
      ...prev,
      filterType: name,
      filterVariantIndex: 0,
      filterMatrix: group.variants[0].matrix,
    }));
  };

  const selectVariant = (variant: FilterVariant, index: number) => {
    setState((prev) => ({
      ...prev,
      filterVariantIndex: index,
      filterMatrix: variant.matrix,
    }));
  };

  const currentGroup =
    selectedFilter !== "None" ? getFilterGroup(selectedFilter) : null;
  const showVariants = currentGroup && thumbImage;

  return (
    <ScrollableContainer
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Filter Category Chips */}
      <Text style={styles.label}>Filter</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
      >
        {FILTER_NAMES.map((name) => (
          <TouchableOpacity
            key={name}
            style={[
              styles.filterChip,
              selectedFilter === name && styles.activeFilterChip,
            ]}
            onPress={() => selectCategory(name)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === name && styles.activeFilterText,
              ]}
            >
              {name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Variant Thumbnails */}
      {showVariants && (
        <View style={styles.variantSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            nestedScrollEnabled
            contentContainerStyle={styles.thumbRow}
          >
            {currentGroup.variants.map((variant, idx) => (
              <FilterThumb
                key={variant.name}
                variant={variant}
                thumbImage={thumbImage}
                isSelected={idx === selectedIdx}
                onPress={() => selectVariant(variant, idx)}
              />
            ))}
          </ScrollView>
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
    marginBottom: 6,
    marginTop: 8,
    color: "#333",
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
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
    fontSize: 12,
    fontWeight: "500",
    color: "#333",
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "bold",
  },
  variantSection: {
    marginTop: 10,
  },
  thumbRow: {
    flexDirection: "row",
    gap: 10,
  },
  thumbWrap: {
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: {
    borderColor: "#000",
  },
  thumbCanvas: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
  },
  thumbLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: "#999",
    marginTop: 3,
    marginBottom: 2,
  },
  thumbLabelActive: {
    color: "#000",
    fontWeight: "700",
  },
});
