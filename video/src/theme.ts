import { loadFont } from "@remotion/google-fonts/PublicSans";

/** Public Sans, the portal's typeface. Colours are hardcoded in each component
 * so Remotion Studio can edit them in place. */
export const { fontFamily } = loadFont("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
