import { Audio } from "@remotion/media";
import { Sequence, staticFile } from "remotion";
import { Background } from "./Background";
import { Scene1Intro } from "./Scene1Intro";
import { Scene2Prompt } from "./Scene2Prompt";
import { Scene3Timeline } from "./Scene3Timeline";
import { Scene4Mcp } from "./Scene4Mcp";
import { Scene5Cta } from "./Scene5Cta";
import { SceneArt } from "./SceneArt";
import { SCENE_FRAMES } from "./theme";

// Voiceover starts a few frames after the scene fades in. Lines are 2.1-2.4s, scenes 3s.
const VO_DELAY_FRAMES = 6;

const Voice: React.FC<{ readonly id: string }> = ({ id }) => (
  <Audio
    src={staticFile(`gioi-thieu-workflow/vo-${id}.mp3`)}
    from={VO_DELAY_FRAMES}
    name={`Voice ${id}`}
    durationInFrames={65}
  />
);

export const GioiThieuWorkflow: React.FC = () => {
  return (
    <>
      <Background />
      <Sequence name="Intro" durationInFrames={SCENE_FRAMES}>
        <SceneArt file="gioi-thieu-workflow/art-intro.jpg" />
        <Scene1Intro />
        <Voice id="s1" />
      </Sequence>
      <Sequence name="Describe the idea" from={SCENE_FRAMES} durationInFrames={SCENE_FRAMES}>
        <Scene2Prompt />
        <Voice id="s2" />
      </Sequence>
      <Sequence name="Build with Remotion" from={SCENE_FRAMES * 2} durationInFrames={SCENE_FRAMES}>
        <Scene3Timeline />
        <Voice id="s3" />
      </Sequence>
      <Sequence name="Meta MCP" from={SCENE_FRAMES * 3} durationInFrames={SCENE_FRAMES}>
        <SceneArt file="gioi-thieu-workflow/art-network.jpg" opacity={0.5} />
        <Scene4Mcp />
        <Voice id="s4" />
      </Sequence>
      <Sequence name="CTA" from={SCENE_FRAMES * 4} durationInFrames={SCENE_FRAMES}>
        <SceneArt file="gioi-thieu-workflow/art-burst.jpg" fadeOutFrames={20} />
        <Scene5Cta />
        <Voice id="s5" />
      </Sequence>
    </>
  );
};
