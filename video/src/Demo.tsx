import { linearTiming, TransitionSeries } from "@remotion/transitions";
import { AbsoluteFill, Easing } from "remotion";
import { Clip } from "./Clip";
import { Opening } from "./Opening";
import { settle } from "./settle";
import { Backdrop, Slide } from "./Slide";

/**
 * The cut. Slides carry the sentences; clips are the four recorded flows.
 * Every hand-off is `settle` (16 frames): the outgoing scene drifts away
 * through blur while the next fades up.
 *
 * Clip durations come from `pnpm durations`. Composition total in Root.tsx =
 * sum of sequences minus 16 per transition.
 */
export const Demo: React.FC = () => {
  return (
    <AbsoluteFill name="Stage">
      <Backdrop />
      <TransitionSeries name="OVIL demo">
        <TransitionSeries.Sequence name="Opening" durationInFrames={240}>
          <Opening
            hero="A secure ledger of vehicle ownership."
            mission="OVIL safeguards vehicle records with owner authentication before any information is released."
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence
          name="Flow 1a ServiceOntario"
          durationInFrames={1074}
        >
          <Clip shot="1a" surface="ServiceOntario" file="flow-1a.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence name="Owner" durationInFrames={90}>
          <Slide
            title="The registered owner receives a request for approval."
            chrome={false}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence name="Flow 1b Phone" durationInFrames={401}>
          <Clip shot="1b" surface="Phone" file="flow-1b.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence name="Process" durationInFrames={120}>
          <Slide
            title="The vehicle is checked against government records and the owner's authorization is confirmed."
            chrome={false}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence
          name="Flow 2a Portal green"
          durationInFrames={888}
        >
          <Clip shot="2a" surface="Portal" file="flow-2a.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence name="Failure" durationInFrames={120}>
          <Slide
            title="If a record check fails or approval is not given, the package cannot be issued."
            chrome={false}
          />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence
          name="Flow 2b Portal red"
          durationInFrames={434}
        >
          <Clip shot="2b" surface="Portal" file="flow-2b.mp4" />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={settle()}
          timing={linearTiming({
            durationInFrames: 16,
            easing: Easing.bezier(0.23, 1, 0.32, 1),
          })}
        />

        <TransitionSeries.Sequence name="Close" durationInFrames={120}>
          <Slide
            title="A secure ledger of vehicle ownership."
            lockup
            chrome={false}
          />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
