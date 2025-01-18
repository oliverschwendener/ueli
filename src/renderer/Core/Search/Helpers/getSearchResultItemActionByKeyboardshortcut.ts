import type { SearchResultItemAction } from "@common/Core";
import type { KeyboardEvent } from "react";

type KeyboardShortcut = {
    modifier: string;
    key: string;
};

const deserializeKeyboardShortcut = (keyboardShortcut: string): KeyboardShortcut => {
    const [modifier, key] = keyboardShortcut.split("+");
    return { modifier, key };
};

const keyboardEventMatchesKeyboardShortcut = (keyboardEvent: KeyboardEvent, keyboardShortcut: string) => {
    const { modifier, key } = deserializeKeyboardShortcut(keyboardShortcut);

    const conditions: (() => boolean)[] = [() => keyboardEvent.key === key];

    if (modifier === "Ctrl") {
        conditions.push(() => keyboardEvent.ctrlKey);
    }
    if (modifier === "Shift") {
        conditions.push(() => keyboardEvent.shiftKey);
    }
    if (modifier === "Alt") {
        conditions.push(() => keyboardEvent.altKey);
    }

    return conditions.every((c) => c());
};

export const getSearchResultItemActionByKeyboardshortcut = (
    keyboardEvent: KeyboardEvent,
    actions: SearchResultItemAction[],
): SearchResultItemAction | undefined => {
    for (const action of actions) {
        if (action.keyboardShortcut) {
            if (keyboardEventMatchesKeyboardShortcut(keyboardEvent, action.keyboardShortcut)) {
                return action;
            }
        }
    }

    return undefined;
};
