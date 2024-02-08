import type { Shortcut } from "@common/Extensions/Shortcuts";

export const createTemporaryShortcut = (): Shortcut => ({
    argument: "https://google.com",
    id: `shortcut-${crypto.randomUUID()}`,
    name: "Some website",
    type: "Url",
});
