import { GlobalHotKey } from "./global-hot-key";
import { GlobalHotKeyKey } from "./global-hot-key-key";
import { GlobalHotKeyModifier } from "./global-hot-key-modifier";

export function isValidHotKey(hotKey: GlobalHotKey) {
    return (
        Object.values(GlobalHotKeyModifier).includes(hotKey.modifier!) &&
        Object.values(GlobalHotKeyModifier).includes(hotKey.secondModifier!) &&
        Object.values(GlobalHotKeyKey).includes(hotKey.key)
    );
}
