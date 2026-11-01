import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { colors } from "./theme";

export const Background: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: colors.bg }}>
      <div
        style={{
          position: "absolute",
          left: -700,
          top: -700,
          width: 1400,
          height: 1400,
          background: `radial-gradient(circle, ${colors.blue}55, transparent 65%)`,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 0px", "420px 760px"],
          ),
        }}
      />
      <div
        style={{
          position: "absolute",
          right: -800,
          bottom: -800,
          width: 1600,
          height: 1600,
          background: `radial-gradient(circle, ${colors.purple}55, transparent 65%)`,
          translate: interpolate(
            frame,
            [0, durationInFrames],
            ["0px 0px", "-380px -820px"],
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
