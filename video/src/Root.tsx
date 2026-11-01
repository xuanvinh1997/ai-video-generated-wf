import { Composition } from "remotion";
import { GioiThieuWorkflow } from "./gioi-thieu-workflow";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="gioi-thieu-workflow"
        component={GioiThieuWorkflow}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
