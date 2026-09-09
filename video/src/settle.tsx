import type {
  TransitionPresentation,
  TransitionPresentationComponentProps,
} from "@remotion/transitions";
import { AbsoluteFill } from "remotion";

type SettleProps = Record<string, never>;

/**
 * Custom presentation. The outgoing scene drifts away through blur while the
 * incoming scene fades up underneath it. Pair with an eased timing.
 */
const SettlePresentation: React.FC<
  TransitionPresentationComponentProps<SettleProps>
> = ({ children, presentationDirection, presentationProgress }) => {
  const entering = presentationDirection === "entering";
  const p = presentationProgress;
  return (
    <AbsoluteFill
      style={
        entering
          ? { opacity: p }
          : {
              opacity: 1 - p,
              scale: String(1 + 0.04 * p),
              filter: `blur(${12 * p}px)`,
            }
      }
    >
      {children}
    </AbsoluteFill>
  );
};

export const settle = (): TransitionPresentation<SettleProps> => ({
  component: SettlePresentation,
  props: {},
});
