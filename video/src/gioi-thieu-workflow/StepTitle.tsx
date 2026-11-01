import { Easing, interpolate, useCurrentFrame } from "remotion";
import { colors, gradientText, sans, SIDE } from "./theme";

export const StepTitle: React.FC<{
  readonly step: string;
  readonly text: string;
}> = ({ step, text }) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: SIDE,
        right: SIDE,
        fontFamily: sans,
        fontWeight: 800,
        fontSize: 96,
        lineHeight: 1.15,
        color: colors.text,
        opacity: interpolate(frame, [0, 14], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
        translate: interpolate(frame, [0, 20], ["0px 40px", "0px 0px"], {
          easing: Easing.bezier(0.16, 1, 0.3, 1),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }),
      }}
    >
      <span style={gradientText}>{step}</span> {text}
    </div>
  );
};
