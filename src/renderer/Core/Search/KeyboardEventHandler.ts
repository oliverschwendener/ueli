import type { KeyboardEvent } from "react";

export type KeyboardEventHandlerReturnType<T> = {
    verificationResult: boolean;
    data: T;
};

export type KeyboardEventHandler<T> = {
    needsToInvokeListener: (keyboardEvent: KeyboardEvent) => KeyboardEventHandlerReturnType<T>;
    listener: (data: T) => void;
};
