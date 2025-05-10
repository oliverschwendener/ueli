import type { Tray } from "electron";
import type { ContextMenuBuilder } from "./ContextMenuBuilder";
import type { ContextMenuTemplateProvider } from "./ContextMenuTemplateProvider";
import type { TrayCreator } from "./TrayCreator";
import type { TrayIconFilePathResolver } from "./TrayIconFilePathResolver";

export class TrayIconManager {
    private tray?: Tray;

    public constructor(
        private readonly trayCreator: TrayCreator,
        private readonly trayIconFilePathResolver: TrayIconFilePathResolver,
        private readonly contextMenuTemplateProvider: ContextMenuTemplateProvider,
        private readonly contextMenuBuilder: ContextMenuBuilder,
    ) {}

    public async createTrayIcon() {
        this.tray = this.trayCreator.createTray(this.trayIconFilePathResolver.resolve());
        this.tray?.setToolTip("Ueli");
        await this.updateContextMenu();
    }

    public updateImage() {
        this.tray?.setImage(this.trayIconFilePathResolver.resolve());
    }

    public async updateContextMenu() {
        const template = await this.contextMenuTemplateProvider.get();
        const menu = this.contextMenuBuilder.buildFromTemplate(template);
        this.tray?.setContextMenu(menu);
    }

    public destory() {
        this.tray?.destroy();
    }
}
