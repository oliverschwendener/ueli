import type { KeyboardEvent } from "react";
import { describe, expect, it } from "vitest";
import { keyboardEventMatchesKeyboardShortcut } from "./keyboardEventMatchesKeyboardShortcut";

describe(keyboardEventMatchesKeyboardShortcut, () => {
    const test = ({
        expected,
        keyboardEvent,
        keyboardShortcut,
    }: {
        expected: boolean;
        keyboardEvent: KeyboardEvent;
        keyboardShortcut: string;
    }) => expect(keyboardEventMatchesKeyboardShortcut(keyboardEvent, keyboardShortcut)).toBe(expected);

    it("should return true when expected", () => {
        test({
            expected: true,
            keyboardEvent: <KeyboardEvent>{ key: "A", ctrlKey: true },
            keyboardShortcut: "Ctrl+a",
        });

        test({
            expected: true,
            keyboardEvent: <KeyboardEvent>{ key: "a", ctrlKey: true },
            keyboardShortcut: "Ctrl+A",
        });

        test({
            expected: true,
            keyboardEvent: <KeyboardEvent>{ key: "Enter" },
            keyboardShortcut: "Enter",
        });
    });

    it("should return false when expected", () => {
        test({
            expected: false,
            keyboardEvent: <KeyboardEvent>{ key: "a", ctrlKey: false },
            keyboardShortcut: "Ctrl+a",
        });

        test({
            expected: false,
            keyboardEvent: <KeyboardEvent>{ key: "a", ctrlKey: true },
            keyboardShortcut: "Shift+A",
        });

        test({
            expected: false,
            keyboardEvent: <KeyboardEvent>{ key: "a", shiftKey: true, ctrlKey: true },
            keyboardShortcut: "Shift+A",
        });

        test({
            expected: false,
            keyboardEvent: <KeyboardEvent>{ key: "ArrowUp" },
            keyboardShortcut: "Enter",
        });

        test({
            expected: false,
            keyboardEvent: <KeyboardEvent>{ key: "Enter", shiftKey: true },
            keyboardShortcut: "Enter",
        });
    });
});
