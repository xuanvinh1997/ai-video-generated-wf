import { loadFont as loadSans } from "@remotion/google-fonts/BeVietnamPro";
import { loadFont as loadMono } from "@remotion/google-fonts/JetBrainsMono";

export const sans = loadSans("normal", {
  weights: ["600", "800"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const mono = loadMono("normal", {
  weights: ["600"],
  subsets: ["latin", "vietnamese"],
}).fontFamily;

export const colors = {
  bg: "#0b0d1a",
  panel: "#141831",
  line: "#2a3060",
  text: "#f4f6ff",
  muted: "#8d93b8",
  blue: "#4f8cff",
  purple: "#9b6bff",
  pink: "#ff6bb5",
};

export const gradientText = {
  backgroundImage: `linear-gradient(90deg, ${colors.blue}, ${colors.purple})`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
} as const;

// 5 scenes x 3s at 30fps
export const SCENE_FRAMES = 90;
export const SIDE = 80;
