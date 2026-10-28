import { defineSettings } from "@getpaseo/plugin";
import { z } from "zod";

export const FONT_SCALES = ["small", "default", "large"] as const;
export type FontScale = (typeof FONT_SCALES)[number];
export const MATH_SCALES = [0.75, 1, 1.25, 1.5, 2] as const;
export type MathScale = (typeof MATH_SCALES)[number];

/** Host-scoped preferences; Mermaid always uses Paseo's renderer. */
export const moduleSettings = defineSettings({
  id: "modules",
  scope: "host",
  version: 1,
  schema: z.object({
    math: z.boolean().default(true),
    codeBlocks: z.boolean().default(false),
    tables: z.boolean().default(false),
    fontScale: z.enum(FONT_SCALES).default("default"),
    mathScale: z.literal(MATH_SCALES).default(1),
  }),
});

export type ModuleSettings = z.output<typeof moduleSettings.schema>;

export const DEFAULT_MODULE_SETTINGS: ModuleSettings = moduleSettings.schema.parse({});

/**
 * Reads the host's content text size, which already carries the user's appearance setting.
 * The theme is inspected structurally because `PluginTheme` in the SDK versions this plugin
 * compiles against does not declare `fontSize`, and hosts without it supply no content size.
 */
export function themeContentSize(theme: unknown): number | undefined {
  if (!theme || typeof theme !== "object" || !("fontSize" in theme)) return undefined;
  const fontSize = (theme as { fontSize?: unknown }).fontSize;
  if (!fontSize || typeof fontSize !== "object" || !("content" in fontSize)) return undefined;
  const content = (fontSize as { content?: unknown }).content;
  return typeof content === "number" && Number.isFinite(content) && content > 0
    ? content
    : undefined;
}

/**
 * Base text size for the Markdown this plugin renders. `contentSize` is the host's content
 * size when the host exposes one; hosts without it keep the fixed sizes used before it existed.
 */
export function fontScaleToBaseSize(
  scale: FontScale,
  contentSize: number | undefined,
  compact: boolean,
): number {
  const base = contentSize ?? (compact ? 14 : 16);
  if (scale === "small") return base - 2;
  if (scale === "large") return base + 2;
  return base;
}
