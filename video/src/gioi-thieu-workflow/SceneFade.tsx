import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { SCENE_FRAMES } from "./theme";

// Fades a scene in and out so cuts between sequences are soft.
export const SceneFade: React.FC<{
  readonly children: React.ReactNode;
  readonly fadeOutFrames?: number;
}> = ({ children, fadeOutFrames = 8 }) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        opacity: interpolate(
          frame,
          [0, 6, SCENE_FRAMES - fadeOutFrames, SCENE_FRAMES],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
