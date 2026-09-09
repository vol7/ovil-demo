import { Video } from "@remotion/media";
import { AbsoluteFill, getStaticFiles, staticFile } from "remotion";
import { fontFamily } from "./theme";

type ClipProps = {
  /** File name inside public/clips, e.g. "1-2-buyer.mp4". */
  file: string;
  /** Screenplay shot number, shown on the slate when the file is missing. */
  shot: string;
  /** Portal | Phone | ServiceOntario, for the slate. */
  surface: string;
  /** Source frames to skip, at 30 fps. */
  trimBefore?: number;
};

/**
 * One recorded shot. Fits any clip size inside the 1920x1080 frame on a dark
 * matte. Missing files render a slate so the timeline can be previewed before
 * anything is recorded.
 */
export const Clip: React.FC<ClipProps> = ({
  file,
  shot,
  surface,
  trimBefore = 0,
}) => {
  const path = `clips/${file}`;
  const exists = getStaticFiles().some((f) => f.name === path);

  if (!exists) {
    return <Slate shot={shot} surface={surface} file={file} />;
  }

  return (
    <AbsoluteFill>
      <Video
        name={`Shot ${shot}`}
        src={staticFile(path)}
        trimBefore={trimBefore}
        muted
        objectFit="contain"
        style={{ width: "100%", height: "100%" }}
      />
    </AbsoluteFill>
  );
};

const Slate: React.FC<{ shot: string; surface: string; file: string }> = ({
  shot,
  surface,
  file,
}) => (
  <AbsoluteFill
    style={{
      backgroundColor: "#1c1c1e",
      color: "#a3a3a3",
      fontFamily,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
    }}
  >
    <div
      style={{
        fontSize: 28,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
      }}
    >
      {surface}
    </div>
    <div
      style={{
        fontSize: 120,
        fontWeight: 700,
        color: "#fafafa",
        letterSpacing: "-0.03em",
      }}
    >
      Shot {shot}
    </div>
    <div style={{ fontSize: 28, fontFamily: "ui-monospace, Menlo, monospace" }}>
      public/clips/{file}
    </div>
  </AbsoluteFill>
);
