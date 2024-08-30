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
            hotkeys: [
                "Alt+Space",
                "Ctrl+Space",
                "Space",
                "A",
                "Shift+A",
                "Shift+a",
                "Super+0",
                "Meta+F12",
                "Alt+,",
                "Alt+.",
                "Alt+/",
                "Alt+\\",
                'Alt+"',
                "Alt+`",
                "Alt+[",
                "Alt+]",
                "Alt+(",
                "Alt+)",
                "Ctrl+Shift+Space",
                "Alt+Shift+F2",
                "Ctrl+Alt+Shift+Super+F8",
            ],
        }));

    it("should return false for all invalid hotkeys", () =>
        testIsValidHotkey({
            expected: false,
            hotkeys: [
                "Space+Alt",
                "",
                " ",
                "abc",
                "F25",
                "Windows+Space",
                "Alt Space",
                "Shift+Shift+Space",
                "Ctrl+Space+F",
                "Shift+Space+Ctrl",
                "F+Shift",
            ],
        }));
});
