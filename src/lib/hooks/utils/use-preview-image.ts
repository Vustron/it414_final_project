// utils
import { create } from "zustand"

interface PreviewImageState {
  loadImage: string | null
  setImage: (loadImage: string | null) => void
}

export const usePreviewImage = create<PreviewImageState>((set) => ({
  loadImage: null,
  setImage: (loadImage: string | null) => set({ loadImage }),
}))
