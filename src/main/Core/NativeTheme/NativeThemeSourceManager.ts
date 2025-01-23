import type { NativeTheme } from "electron";
import type { NativeThemeSource } from "./NativeThemeSource";

export class NativeThemeSourceManager {
    public constructor(private readonly nativeTheme: NativeTheme) {}

    public setSource(source: NativeThemeSource) {
        this.nativeTheme.themeSource = source;
    }
}
