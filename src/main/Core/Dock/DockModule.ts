import type { App } from "electron";

export class DockModule {
    public static bootstrap(app: App) {
        app.dock?.hide();
    }
}
