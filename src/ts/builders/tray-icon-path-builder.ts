import { join } from "path";

export class TrayIconPathBuilder {
    public static buildWindowsTrayIconPath(pathToProjectRoot: string): string {
        return join(pathToProjectRoot, "img/icons/win/icon.ico");
    }

    public static buildMacOsTrayIconPath(pathToProjectRoot: string): string {
        return join(pathToProjectRoot, "img/icons/mac/ueliTemplate.png");
    }
}
