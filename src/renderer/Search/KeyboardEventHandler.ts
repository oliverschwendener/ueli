import type { KeyboardEvent } from "react";

export type KeyboardEventHandler = {
    needsToInvokeListener: (keyboardEvent: KeyboardEvent<HTMLElement>) => boolean;
    listener: (keyboardEvent: KeyboardEvent<HTMLElement>) => void;
};
