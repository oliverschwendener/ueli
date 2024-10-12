import type { App } from "electron";
import type { AutostartManager } from "./AutostartManager";

export class DefaultAutostartManager implements AutostartManager {
    public constructor(
        private readonly app: App,
        private readonly process: NodeJS.Process,
    ) {}

    public setAutostartOptions(openAtLogin: boolean): void {
        this.app.setLoginItemSettings({
            args: [],
            openAtLogin,
            path: this.process.execPath,
        });
    }

    public autostartIsEnabled(): boolean {
        return this.app.getLoginItemSettings().openAtLogin;
    }
}
