import type { Menu, MenuItemConstructorOptions, Tray } from "electron";
import { describe, expect, it, vi } from "vitest";
import type { ContextMenuBuilder } from "./ContextMenuBuilder";
import type { ContextMenuTemplateProvider } from "./ContextMenuTemplateProvider";
import type { TrayCreator } from "./TrayCreator";
import type { TrayIconFilePathResolver } from "./TrayIconFilePathResolver";
import { TrayIconManager } from "./TrayIconManager";

describe(TrayIconManager, () => {
    describe(TrayIconManager.prototype.createTrayIcon, () => {
        it("should create a tray, set tooltip, and update the context menu", async () => {
            const setContextMenuMock = vi.fn();
            const setToolTipMock = vi.fn();

            const createTrayMock = vi.fn().mockReturnValue(<Tray>{
                setContextMenu: (m) => setContextMenuMock(m),
                setToolTip: (t) => setToolTipMock(t),
            });

            const trayCreator = <TrayCreator>{ createTray: (i) => createTrayMock(i) };

            const dummyTrayIconFilePath = "test-tray-icon-file-path";
            const resolveTrayIconFilePath = vi.fn().mockReturnValue(dummyTrayIconFilePath);
            const trayIconFilePathResolver = <TrayIconFilePathResolver>{ resolve: () => resolveTrayIconFilePath() };

            const dummyContextMenuTemplate = <MenuItemConstructorOptions[]>[{}];
            const getContextMenuTemplateMock = vi.fn().mockResolvedValue(dummyContextMenuTemplate);
            const contextMenuTemplateProvider = <ContextMenuTemplateProvider>{
                get: () => getContextMenuTemplateMock(),
            };

            const dummyMenu = <Menu>{};
            const buildFromTemplateMock = vi.fn().mockReturnValue(dummyMenu);
            const contextMenuBuilder = <ContextMenuBuilder>{ buildFromTemplate: (t) => buildFromTemplateMock(t) };

            const trayIconManager = new TrayIconManager(
                trayCreator,
                trayIconFilePathResolver,
                contextMenuTemplateProvider,
                contextMenuBuilder,
            );

            await trayIconManager.createTrayIcon();

            expect(createTrayMock).toHaveBeenCalledOnce();
            expect(createTrayMock).toHaveBeenCalledWith(dummyTrayIconFilePath);
            expect(getContextMenuTemplateMock).toHaveBeenCalledOnce();
            expect(buildFromTemplateMock).toHaveBeenCalledOnce();
            expect(buildFromTemplateMock).toHaveBeenCalledWith(dummyContextMenuTemplate);
            expect(setToolTipMock).toHaveBeenCalledWith("Ueli");
            expect(setContextMenuMock).toHaveBeenCalledOnce();
            expect(setContextMenuMock).toHaveBeenCalledWith(dummyMenu);
        });
    });

    describe(TrayIconManager.prototype.updateImage, () => {
        it("shouldn't do anything if there is no tray", () => {
            const resolveTrayIconFilePath = vi.fn().mockReturnValue("test-tray-icon-file-path");

            const trayIconManager = new TrayIconManager(
                <TrayCreator>{},
                <TrayIconFilePathResolver>{ resolve: () => resolveTrayIconFilePath() },
                <ContextMenuTemplateProvider>{},
                <ContextMenuBuilder>{},
            );

            trayIconManager.updateImage();

            expect(resolveTrayIconFilePath).not.toHaveBeenCalled();
        });

        it("should update the tray icon if the tray has been set", () => {
            const resolveTrayIconFilePath = vi.fn().mockReturnValue("test-tray-icon-file-path");
            const setImageMock = vi.fn();

            const trayIconManager = new TrayIconManager(
                <TrayCreator>{},
                <TrayIconFilePathResolver>{ resolve: () => resolveTrayIconFilePath() },
                <ContextMenuTemplateProvider>{},
                <ContextMenuBuilder>{},
            );

            trayIconManager["tray"] = <Tray>{ setImage: (i) => setImageMock(i) };

            trayIconManager.updateImage();

            expect(resolveTrayIconFilePath).toHaveBeenCalledOnce();
            expect(setImageMock).toHaveBeenCalledOnce();
            expect(setImageMock).toHaveBeenCalledWith("test-tray-icon-file-path");
        });
    });

    describe(TrayIconManager.prototype.destory, () => {
        it("should destroy the tray if it exists", () => {
            const destroyMock = vi.fn();

            const trayIconManager = new TrayIconManager(
                <TrayCreator>{},
                <TrayIconFilePathResolver>{},
                <ContextMenuTemplateProvider>{},
                <ContextMenuBuilder>{},
            );

            trayIconManager["tray"] = <Tray>{ destroy: () => destroyMock() };

            trayIconManager.destory();

            expect(destroyMock).toHaveBeenCalledOnce();
        });

        it("should do nothing if the tray doesn't exist", () => {
            const trayIconManager = new TrayIconManager(
                <TrayCreator>{},
                <TrayIconFilePathResolver>{},
                <ContextMenuTemplateProvider>{},
                <ContextMenuBuilder>{},
            );

            trayIconManager.destory();

            expect(trayIconManager["tray"]).toBeUndefined();
        });
    });
});
