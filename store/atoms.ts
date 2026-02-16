import { atom } from "jotai";
import { IDENTITY } from "../constants/filters";

export interface EditorState {
  imageUri: string | null;
  thumbnailUri: string | null; // Small preview for filter thumbnails
  frameWidth: number;
  frameColor: string;
  backgroundColor: string;
  filterType: string; // Category name ("None", "Mono", etc.)
  filterVariantIndex: number; // Index of the selected variant within the group
  filterMatrix: number[]; // Actual ColorMatrix being applied
  aspectRatio: number;
  grain: number;
  vignette: number;
}

const defaultState: EditorState = {
  imageUri: null,
  thumbnailUri: null,
  frameWidth: 0,
  frameColor: "#FFFFFF",
  backgroundColor: "#000000",
  filterType: "None",
  filterVariantIndex: 0,
  filterMatrix: IDENTITY,
  aspectRatio: 1,
  grain: 0,
  vignette: 0,
};

export const editorStateAtom = atom<EditorState>(defaultState);

// Reset all state to defaults when a new image is loaded
export const setImageWithResetAtom = atom(
  null,
  (get, set, payload: { uri: string | null; thumbnailUri: string | null }) => {
    set(editorStateAtom, {
      ...defaultState,
      imageUri: payload.uri,
      thumbnailUri: payload.thumbnailUri,
    });
  },
);
