import { GlobalHotKeyModifier } from "./global-hot-key-modifier";
import { GlobalHotKeyKey } from "./global-hot-key-key";

export interface GlobalHotKey {
    key: GlobalHotKeyKey;
    firstModifier?: GlobalHotKeyModifier;
    secondModifier?: GlobalHotKeyModifier;
}
