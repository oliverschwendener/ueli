import { describe, expect, it } from "vitest";
import { isValidHotkey } from "./Hotkey";

describe(isValidHotkey, () => {
    const testIsValidHotkey = ({ expected, hotkeys }: { expected: boolean; hotkeys: string[] }) => {
        for (const hotkey of hotkeys) {
            expect(isValidHotkey(hotkey)).toBe(expected);
        }
    };

    it("should return true for all valid hotkeys", () =>
        testIsValidHotkey({
            expected: true,
            hotkeys: ["Alt+Space", "Ctrl+Space", "Space", "A", "Shift+A", "Shift+a", "Super+0", "Meta+F12"],
        }));

    it("should return false for all invalid hotkeys", () =>
        testIsValidHotkey({
            expected: false,
            hotkeys: ["Space+Alt", "", " ", "abc", "F25", "Windows+Space", "Alt Space"],
        }));
});
