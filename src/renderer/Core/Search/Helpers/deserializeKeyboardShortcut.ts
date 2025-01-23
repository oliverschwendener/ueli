import type { KeyboardShortcut } from "./KeyboardShortcut";

export const deserializeKeyboardShortcut = (keyboardShortcut: string): KeyboardShortcut => {
    const [modifier, key] = keyboardShortcut.split("+");

    return {
        modifier: key ? modifier : undefined,
        key: key ? key : modifier,
    };
};
