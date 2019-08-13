import { GlobalHotKey } from "./global-hot-key";
import { GlobalHotKeyKey } from "./global-hot-key-key";
import { GlobalHotKeyModifier } from "./global-hot-key-modifier";

export function isValidHotKey(hotKey: GlobalHotKey) {
    return Object.keys(GlobalHotKeyKey).find((k) => k === hotKey.key) !== undefined
        && (hotKey.modifier ? Object.keys(GlobalHotKeyModifier).find((m) => m === hotKey.modifier) : true);
}
