import { describe, expect, it } from "vitest";
import { FONT_SCALES, fontScaleToBaseSize, themeContentSize } from "../shared/settings.js";

describe("plugin text size", () => {
  it.each([
    ["small", 13],
    ["default", 15],
    ["large", 17],
  ] as const)("offsets %s from the host's content size", (scale, expected) => {
    expect(fontScaleToBaseSize(scale, 15, false)).toBe(expected);
    expect(fontScaleToBaseSize(scale, 15, true)).toBe(expected);
  });

  it.each(FONT_SCALES)(
    "keeps the previous fixed sizes when the host has no content size",
    (scale) => {
      const offset = scale === "small" ? -2 : scale === "large" ? 2 : 0;
      expect(fontScaleToBaseSize(scale, undefined, false)).toBe(16 + offset);
      expect(fontScaleToBaseSize(scale, undefined, true)).toBe(14 + offset);
    },
  );

  it("reads the content size from a theme that declares one", () => {
    expect(themeContentSize({ colors: {}, fontSize: { sm: 12, content: 19 } })).toBe(19);
  });

  it.each([
    ["a theme without fontSize", { colors: {} }],
    ["a theme without content", { fontSize: { sm: 12 } }],
    ["a non-numeric content", { fontSize: { content: "19" } }],
    ["a zero content", { fontSize: { content: 0 } }],
    ["a non-finite content", { fontSize: { content: Number.POSITIVE_INFINITY } }],
    ["a null theme", null],
    ["undefined", undefined],
  ])("reports no content size for %s", (_label, theme) => {
    expect(themeContentSize(theme)).toBeUndefined();
  });
});
