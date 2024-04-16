import type { ShortcutType } from "./ShortcutType";

export type Shortcut = {
    name: string;
    id: string;
    type: ShortcutType;
    argument: string;
    options?: Record<string, unknown>;
};
