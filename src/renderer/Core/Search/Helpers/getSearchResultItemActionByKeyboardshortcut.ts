import type { SearchResultItemAction } from "@common/Core";
import type { KeyboardEvent } from "react";
import { keyboardEventMatchesKeyboardShortcut } from "./keyboardEventMatchesKeyboardShortcut";

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
