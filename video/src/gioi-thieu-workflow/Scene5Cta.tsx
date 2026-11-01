import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { colors, sans, SIDE } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const enter = Easing.bezier(0.16, 1, 0.3, 1);

export const Scene5Cta: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade fadeOutFrames={20}>
      <AbsoluteFill
        style={{
          padding: `0 ${SIDE}px`,
          justifyContent: "center",
          alignItems: "center",
          fontFamily: sans,
          scale: interpolate(frame, [0, 90], [0.92, 1], clamp),
        }}
      >
        <div
          style={{
            fontWeight: 800,
            fontSize: 150,
            color: colors.text,
            marginBottom: 72,
            opacity: interpolate(frame, [4, 20], [0, 1], clamp),
            translate: interpolate(frame, [4, 30], ["0px 60px", "0px 0px"], {
              ...clamp,
              easing: enter,
            }),
          }}
        >
          Try it now:
        </div>
        <div
          style={{
            padding: "64px 88px",
            borderRadius: 120,
            textAlign: "center",
            fontWeight: 800,
            fontSize: 100,
            lineHeight: 1.2,
            color: colors.text,
            backgroundImage: `linear-gradient(90deg, ${colors.blue}, ${colors.purple})`,
            boxShadow: `0 30px 120px ${colors.purple}77`,
            opacity: interpolate(frame, [18, 34], [0, 1], clamp),
            scale: interpolate(frame, [18, 44], [0.8, 1], {
              ...clamp,
              easing: enter,
              output: "perceptual-scale",
            }),
          }}
        >
          Claude Code
          <br />+ Remotion
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
