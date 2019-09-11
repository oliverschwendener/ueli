import { Shortcut } from "../../main/plugins/shortcuts-search-plugin/shortcut";

export interface ShortcutOptions {
    isEnabled: boolean;
    shortcuts: Shortcut[];
}

export const defaultShortcutOptions: ShortcutOptions = {
    isEnabled: false,
    shortcuts: [],
};
