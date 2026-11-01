import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { colors, gradientText, sans, SIDE } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const enter = Easing.bezier(0.16, 1, 0.3, 1);

export const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade>
      <AbsoluteFill
        style={{
          padding: `0 ${SIDE}px`,
          justifyContent: "center",
          fontFamily: sans,
        }}
      >
        <div
          style={{
            fontWeight: 600,
            fontSize: 44,
            letterSpacing: 8,
            color: colors.muted,
            marginBottom: 48,
            opacity: interpolate(frame, [0, 15], [0, 1], clamp),
          }}
        >
          AI VIDEO WORKFLOW
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1.1,
            color: colors.text,
            opacity: interpolate(frame, [4, 20], [0, 1], clamp),
            translate: interpolate(frame, [4, 28], ["0px 80px", "0px 0px"], {
              ...clamp,
              easing: enter,
            }),
          }}
        >
          AI video,
        </div>
        <div
          style={{
            fontWeight: 800,
            fontSize: 108,
            lineHeight: 1.1,
            opacity: interpolate(frame, [14, 30], [0, 1], clamp),
            translate: interpolate(frame, [14, 38], ["0px 80px", "0px 0px"], {
              ...clamp,
              easing: enter,
            }),
            ...gradientText,
          }}
        >
          written in code.
        </div>
        <div
          style={{
            marginTop: 64,
            height: 8,
            borderRadius: 4,
            backgroundImage: `linear-gradient(90deg, ${colors.blue}, ${colors.purple})`,
            width: interpolate(frame, [30, 70], [0, 920], {
              ...clamp,
              easing: enter,
            }),
          }}
        />
      </AbsoluteFill>
    </SceneFade>
  );
};
