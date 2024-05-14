import { Tray } from "electron";

export class TrayCreator {
    public createTray(iconFilePath: string): Tray {
        return new Tray(iconFilePath);
    }
}
