import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { SceneFade } from "./SceneFade";
import { StepTitle } from "./StepTitle";
import { colors, gradientText, sans, SIDE } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const enter = Easing.bezier(0.16, 1, 0.3, 1);

const CARD_W = 290;
const CARD_GAP = 25;
const CARD_H = 300;
const cards = [
  { label: "Ads", color: colors.blue },
  { label: "Social", color: colors.purple },
  { label: "WhatsApp", color: colors.pink },
];

export const Scene4Mcp: React.FC = () => {
  const frame = useCurrentFrame();
  const hubScale = interpolate(frame, [4, 24], [0.6, 1], {
    ...clamp,
    easing: enter,
    output: "perceptual-scale",
  });

  return (
    <SceneFade>
      <StepTitle step="3." text="Connect Meta via MCP" />
      <AbsoluteFill style={{ paddingTop: 640 }}>
        <div style={{ position: "relative", margin: `0 ${SIDE}px`, width: 920 }}>
          <div
            style={{
              margin: "0 auto",
              width: 560,
              height: 150,
              borderRadius: 75,
              backgroundImage: `linear-gradient(90deg, ${colors.blue}, ${colors.purple})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: sans,
              fontWeight: 800,
              fontSize: 56,
              color: colors.text,
              scale: hubScale,
              opacity: interpolate(frame, [4, 16], [0, 1], clamp),
            }}
          >
            Claude Code
          </div>

          <svg
            width={920}
            height={160}
            style={{ display: "block", overflow: "visible" }}
          >
            {cards.map((c, i) => {
              const x = CARD_W / 2 + i * (CARD_W + CARD_GAP);
              const length = 200;
              return (
                <path
                  key={c.label}
                  d={`M 460 0 C 460 80, ${x} 80, ${x} 160`}
                  stroke={c.color}
                  strokeWidth={6}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={length * 2}
                  strokeDashoffset={interpolate(
                    frame,
                    [24 + i * 10, 44 + i * 10],
                    [length * 2, 0],
                    clamp,
                  )}
                />
              );
            })}
          </svg>

          <div style={{ display: "flex", gap: CARD_GAP }}>
            {cards.map((c, i) => (
              <div
                key={c.label}
                style={{
                  width: CARD_W,
                  height: CARD_H,
                  borderRadius: 32,
                  backgroundColor: colors.panel,
                  border: `3px solid ${c.color}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: sans,
                  fontWeight: 800,
                  fontSize: 44,
                  color: colors.text,
                  opacity: interpolate(frame, [38 + i * 10, 50 + i * 10], [0, 1], clamp),
                  scale: interpolate(
                    frame,
                    [38 + i * 10, 58 + i * 10],
                    [0.7, 1],
                    { ...clamp, easing: enter, output: "perceptual-scale" },
                  ),
                }}
              >
                <span style={i === 1 ? gradientText : undefined}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </AbsoluteFill>
    </SceneFade>
  );
};
