import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { StepTitle } from "./StepTitle";
import { colors, mono, SIDE } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const PROMPT = "Make a 15s product intro video";

export const Scene2Prompt: React.FC = () => {
  const frame = useCurrentFrame();
  const typed = Math.floor(
    interpolate(frame, [18, 66], [0, PROMPT.length], clamp),
  );
  const cursorOn = Math.floor(frame / 8) % 2 === 0;

  return (
    <SceneFade>
      <StepTitle step="1." text="Describe your idea" />
      <AbsoluteFill
        style={{ padding: `0 ${SIDE}px`, justifyContent: "center", paddingTop: 260 }}
      >
        <div
          style={{
            height: 440,
            borderRadius: 36,
            backgroundColor: colors.panel,
            border: `2px solid ${colors.line}`,
            boxShadow: `0 40px 120px #00000088`,
            opacity: interpolate(frame, [6, 20], [0, 1], clamp),
            translate: interpolate(frame, [6, 26], ["0px 60px", "0px 0px"], {
              ...clamp,
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
          }}
        >
          <div style={{ display: "flex", gap: 16, padding: "32px 36px" }}>
            {[colors.pink, colors.purple, colors.blue].map((c) => (
              <div
                key={c}
                style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c }}
              />
            ))}
          </div>
          <div
            style={{
              padding: "16px 48px",
              fontFamily: mono,
              fontWeight: 600,
              fontSize: 56,
              lineHeight: 1.5,
              color: colors.text,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <span style={{ color: colors.blue }}>{"> "}</span>
            {PROMPT.slice(0, typed)}
            <span
              style={{
                display: "inline-block",
                width: 28,
                height: 56,
                marginLeft: 6,
                verticalAlign: "text-bottom",
                backgroundColor: colors.purple,
                opacity: cursorOn ? 1 : 0,
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
