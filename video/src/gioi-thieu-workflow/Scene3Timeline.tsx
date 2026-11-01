import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { StepTitle } from "./StepTitle";
import { colors, sans, SIDE } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const enter = Easing.bezier(0.16, 1, 0.3, 1);
const TRACK_W = 920;
const TRACK_H = 150;
const GAP = 36;

const blocks = [
  { label: "Scene 1", x: 0, w: 400, color: colors.blue },
  { label: "Scene 2", x: 240, w: 460, color: colors.purple },
  { label: "Scene 3", x: 500, w: 420, color: colors.pink },
];

export const Scene3Timeline: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <SceneFade>
      <StepTitle step="2." text="Agent builds it in Remotion" />
      <AbsoluteFill
        style={{ padding: `0 ${SIDE}px`, justifyContent: "center", paddingTop: 360 }}
      >
        <div style={{ position: "relative", width: TRACK_W }}>
          {blocks.map((b, i) => (
            <div
              key={b.label}
              style={{
                position: "relative",
                height: TRACK_H,
                marginBottom: i < blocks.length - 1 ? GAP : 0,
                borderRadius: 28,
                backgroundColor: colors.panel,
                border: `2px solid ${colors.line}`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  bottom: 12,
                  left: b.x + 12,
                  width: b.w - 24,
                  borderRadius: 20,
                  backgroundColor: b.color,
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 36,
                  fontFamily: sans,
                  fontWeight: 800,
                  fontSize: 52,
                  color: colors.text,
                  opacity: interpolate(frame, [8 + i * 8, 22 + i * 8], [0, 1], clamp),
                  translate: interpolate(
                    frame,
                    [8 + i * 8, 34 + i * 8],
                    ["-400px 0px", "0px 0px"],
                    { ...clamp, easing: enter },
                  ),
                }}
              >
                {b.label}
              </div>
            </div>
          ))}
          <div
            style={{
              position: "absolute",
              top: -30,
              bottom: -30,
              left: 0,
              width: 6,
              borderRadius: 3,
              backgroundColor: colors.text,
              boxShadow: `0 0 40px ${colors.text}`,
              opacity: interpolate(frame, [40, 46], [0, 1], clamp),
              translate: interpolate(frame, [40, 82], ["0px 0px", `${TRACK_W - 6}px 0px`], {
                ...clamp,
                easing: Easing.inOut(Easing.quad),
              }),
            }}
          />
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
