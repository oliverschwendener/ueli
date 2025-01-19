import type { KeyboardEvent } from "react";

export type KeyboardEventHandlerReturnType = {
    shouldInvokeAction: boolean;
    action: () => void;
};

export type KeyboardEventHandler = {
    check: (keyboardEvent: KeyboardEvent) => KeyboardEventHandlerReturnType;
};
