import font0 from "@/src/fonts/797e433ab948586e-s.p.08e28id.o-okb.woff2?url";
import font1 from "@/src/fonts/caa3a2e1cccd8315-s.p.09~u27dqhyhd6.woff2?url";

/**
 * The few things the old Next build added by itself, per site: the font
 * preloads, the favicon links and the share-image link of app/opengraph-image.png,
 * with the same cache keys (the "?…" part) the old site used.
 */
const preloadFont = (href: string) =>
  `<link rel="preload" href="${href}" as="font" crossorigin="" type="font/woff2"/>`;

export const site = {
  fontPreloads: [font0, font1].map(preloadFont).join(""),
  iconLinks:
    "<link rel=\"icon\" href=\"/favicon.ico?favicon.109bgrjrcat-m.ico\" sizes=\"200x200\" type=\"image/x-icon\"/>" +
    "<link rel=\"icon\" href=\"/icon.png?icon.0fs9iaounkhrw.png\" sizes=\"48x48\" type=\"image/png\"/>",
  ogImageUrls: {
    "/app/opengraph-image.png": "/opengraph-image.png?opengraph-image.060bvaphn73zg.png",
  } as Record<string, string>,
  /** The code Next added to some share-image routes (/blog/<slug>/opengraph-image-<code>). */
  ogRouteSuffix: {} as Record<string, string>,
};
