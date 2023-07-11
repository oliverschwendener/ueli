import { GlobalHotKey } from "./global-hot-key";
import { GlobalHotKeyKey } from "./global-hot-key-key";
import { GlobalHotKeyModifier } from "./global-hot-key-modifier";

export function isValidHotKey(hotKey: GlobalHotKey) {
    return (
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.values(GlobalHotKeyModifier).includes(hotKey.modifier!) &&
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        Object.values(GlobalHotKeyModifier).includes(hotKey.secondModifier!) &&
        Object.values(GlobalHotKeyKey).includes(hotKey.key)
    );
}
