import type { EventSubscriber } from "@Core/EventSubscriber";
import type { NativeTheme, Tray } from "electron";
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
        private readonly nativeTheme: NativeTheme,
        private readonly eventSubscriber: EventSubscriber,
    ) {}

    public async createTrayIcon() {
        this.tray = this.trayCreator.createTray(this.trayIconFilePathResolver.resolve());
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

    public registerEventListeners() {
        this.nativeTheme.on("updated", () => this.updateImage());
        this.eventSubscriber.subscribe("settingUpdated[general.language]", () => this.updateContextMenu());
    }
}
