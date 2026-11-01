import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { colors, SCENE_FRAMES } from "./theme";

// AI-generated still used as a slowly moving backdrop. The scrim keeps text readable.
export const SceneArt: React.FC<{
  readonly file: string;
  readonly opacity?: number;
  readonly fadeOutFrames?: number;
}> = ({ file, opacity = 0.55, fadeOutFrames }) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame, [0, SCENE_FRAMES], [1.04, 1.2], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.quad),
  });
  const driftY = interpolate(frame, [0, SCENE_FRAMES], [0, -40], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <SceneFade fadeOutFrames={fadeOutFrames}>
      <AbsoluteFill style={{ opacity }}>
        <Img
          src={staticFile(file)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            scale,
            translate: `0px ${driftY}px`,
          }}
        />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(180deg, ${colors.bg}cc 0%, ${colors.bg}33 45%, ${colors.bg}99 100%)`,
        }}
      />
    </SceneFade>
  );
};
