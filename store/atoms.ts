import { atom } from "jotai";

export interface EditorState {
  imageUri: string | null;
  frameWidth: number;
  frameColor: string;
  backgroundColor: string;
  filterType: string;
  aspectRatio: number;
  isControlPanelOpen: boolean;
  grain: number;
  vignette: number;
}

const defaultState: EditorState = {
  imageUri: null,
  frameWidth: 0,
  frameColor: "#FFFFFF",
  backgroundColor: "#000000",
  filterType: "None",
  aspectRatio: 1,
  isControlPanelOpen: false,
  grain: 0,
  vignette: 0,
};

export const editorStateAtom = atom<EditorState>(defaultState);

// -- Actions --

// Reset all state to defaults (except imageUri? or maybe clears everything?)
// The user said "when photo changes, reset all values".
// So we need a "setImage" action that sets the URI and resets everything else.
export const setImageWithResetAtom = atom(
  null, // read
  (get, set, uri: string | null) => {
    set(editorStateAtom, {
      ...defaultState,
      imageUri: uri,
      isControlPanelOpen: false,
    });
  },
);
