import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 900px at 0% 0%, ${colors.blue}55, transparent 70%)`,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 0px", "260px 420px"],
          ),
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(1000px 1000px at 100% 100%, ${colors.purple}55, transparent 70%)`,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 0px", "-240px -520px"],
          ),
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${colors.line}33 1px, transparent 1px), linear-gradient(90deg, ${colors.line}33 1px, transparent 1px)`,
          backgroundSize: "90px 90px",
        }}
      />
    </AbsoluteFill>
  );
};
