import { describe, expect, it } from "vitest";
import { deserializeKeyboardShortcut } from "./deserializeKeyboardShortcut";
import type { KeyboardShortcut } from "./KeyboardShortcut";

describe(deserializeKeyboardShortcut, () => {
    const testDeserializeKeyboardShortcut = ({
        expected,
        keyboardShortcut,
    }: {
        expected: KeyboardShortcut;
        keyboardShortcut: string;
    }) => expect(deserializeKeyboardShortcut(keyboardShortcut)).toEqual(expected);

    it("should deserialize keyboard shortcut with modifier", () => {
        testDeserializeKeyboardShortcut({
            expected: { modifier: "Ctrl", key: "A" },
            keyboardShortcut: "Ctrl+A",
        });

        testDeserializeKeyboardShortcut({
            expected: { modifier: "Alt", key: "N" },
            keyboardShortcut: "Alt+N",
        });

        testDeserializeKeyboardShortcut({
            expected: { modifier: undefined, key: "Enter" },
            keyboardShortcut: "Enter",
        });

        testDeserializeKeyboardShortcut({
            expected: { modifier: "Cmd", key: "ArrowRight" },
            keyboardShortcut: "Cmd+ArrowRight",
        });
    });
});
