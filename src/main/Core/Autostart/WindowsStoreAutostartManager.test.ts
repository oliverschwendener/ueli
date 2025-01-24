import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { Logger } from "@Core/Logger";
import type { App, Shell } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { WindowsStoreAutostartManager } from "./WindowsStoreAutostartManager";

describe(WindowsStoreAutostartManager, () => {
    describe(WindowsStoreAutostartManager.prototype.autostartIsEnabled, () => {
        const testAutostartIsEnabled = ({
            shortcutFileExists,
            shortcutFileReadError,
            shortcutTarget,
            shortcutFileContent,
            expected,
        }: {
            shortcutFileExists: boolean;
            shortcutFileReadError?: string;
            shortcutTarget?: string;
            shortcutFileContent?: string;
            expected: boolean;
        }) => {
            const getPathMock = vi.fn().mockReturnValue("AppData");
            const app = <App>{ getPath: (p) => getPathMock(p) };

            const existsSyncMock = vi.fn().mockReturnValue(shortcutFileExists);
            const readTextFileSync = vi.fn().mockReturnValue(shortcutFileContent);
            const fileSystemUtility = <FileSystemUtility>{
                existsSync: (p) => existsSyncMock(p),
                readTextFileSync: (filePath, encoding) => readTextFileSync(filePath, encoding),
            };

            const readShortcutLinkMock = shortcutFileReadError
                ? vi.fn().mockImplementationOnce(() => {
                      throw new Error(shortcutFileReadError);
                  })
                : vi.fn().mockReturnValue({ target: shortcutTarget });

            const shell = <Shell>{ readShortcutLink: (p) => readShortcutLinkMock(p) };

            const logErrorMock = vi.fn();
            const logger = <Logger>{ error: (m) => logErrorMock(m) };

            expect(new WindowsStoreAutostartManager(app, shell, fileSystemUtility, logger).autostartIsEnabled()).toBe(
                expected,
            );

            expect(getPathMock).toHaveBeenCalledOnce();
            expect(getPathMock).toHaveBeenCalledWith("appData");

            const shortcutFilePath = join(
                "AppData",
                "Microsoft",
                "Windows",
                "Start Menu",
                "Programs",
                "Startup",
                "Ueli.lnk",
            );

            expect(existsSyncMock).toHaveBeenCalledOnce();
            expect(existsSyncMock).toHaveBeenCalledWith(shortcutFilePath);

            if (shortcutFileReadError) {
                expect(logErrorMock).toHaveBeenCalledOnce();
                expect(logErrorMock).toHaveBeenCalledWith(
                    `Failed to read shortcut link "${shortcutFilePath}". Reason: ${new Error(shortcutFileReadError)}`,
                );
            }
        };

        it("should return false when shortcut file does not exist", () => {
            testAutostartIsEnabled({
                shortcutFileExists: false,
                expected: false,
            });
        });

        it("should return false when shortcut file exists but cant be read", () => {
            testAutostartIsEnabled({
                shortcutFileExists: true,
                expected: false,
                shortcutFileReadError: "some error",
            });
        });

        it("should return false when shortcut file exists but target is not as desired", () => {
            testAutostartIsEnabled({
                shortcutFileExists: true,
                shortcutTarget: "other target",
                expected: false,
            });
        });

        it("should return false when shortcut file exists and target is empty and shortcut file content does not contain app id", () => {
            testAutostartIsEnabled({
                shortcutFileExists: true,
                shortcutTarget: "",
                shortcutFileContent: "content without app id",
                expected: false,
            });
        });

        it("should return true when shortcut file exists and target is as desired", () => {
            testAutostartIsEnabled({
                shortcutFileExists: true,
                shortcutTarget: "shell:AppsFolder\\1915OliverSchwendener.Ueli_a397x08q5x7rp!OliverSchwendener.Ueli",
                expected: true,
            });
        });

        it("should return true when shortcut file exists and target is empty but shortcut file content contains app id", () => {
            testAutostartIsEnabled({
                shortcutFileExists: true,
                shortcutTarget: "",
                shortcutFileContent:
                    "some content with app id 1915OliverSchwendener.Ueli_a397x08q5x7rp!OliverSchwendener.Ueli",
                expected: true,
            });
        });
    });

    describe(WindowsStoreAutostartManager.prototype.setAutostartOptions, () => {
        const testSetAutostartOptions = ({
            openAtLogin,
            shortcutFileExists,
            expectedShortcutOperation,
            expectShortcutFileRemoval,
        }: {
            openAtLogin: boolean;
            shortcutFileExists: boolean;
            expectedShortcutOperation?: "create" | "replace";
            expectShortcutFileRemoval: boolean;
        }) => {
            const getPathMock = vi.fn().mockReturnValue("AppData");
            const app = <App>{ getPath: (p) => getPathMock(p) };

            const existsSyncMock = vi.fn().mockReturnValue(shortcutFileExists);
            const removeFileSyncMock = vi.fn();
            const fileSystemUtility = <FileSystemUtility>{
                existsSync: (p) => existsSyncMock(p),
                removeFileSync: (p) => removeFileSyncMock(p),
            };

            const writeShortcutLinkMock = vi.fn();
            const shell = <Shell>{
                writeShortcutLink: (path, operation, options) => writeShortcutLinkMock(path, operation, options),
            };

            const shortcutFilePath = join(
                "AppData",
                "Microsoft",
                "Windows",
                "Start Menu",
                "Programs",
                "Startup",
                "Ueli.lnk",
            );

            new WindowsStoreAutostartManager(app, shell, fileSystemUtility, <Logger>{}).setAutostartOptions(
                openAtLogin,
            );

            expect(getPathMock).toHaveBeenCalledOnce();
            expect(getPathMock).toHaveBeenCalledWith("appData");

            expect(existsSyncMock).toHaveBeenCalledOnce();
            expect(existsSyncMock).toHaveBeenCalledWith(shortcutFilePath);

            if (expectShortcutFileRemoval) {
                expect(removeFileSyncMock).toHaveBeenCalledOnce();
                expect(removeFileSyncMock).toHaveBeenCalledWith(shortcutFilePath);
            }

            if (expectedShortcutOperation) {
                expect(writeShortcutLinkMock).toHaveBeenCalledOnce();
                expect(writeShortcutLinkMock).toHaveBeenCalledWith(shortcutFilePath, expectedShortcutOperation, {
                    target: "shell:AppsFolder\\1915OliverSchwendener.Ueli_a397x08q5x7rp!OliverSchwendener.Ueli",
                });
            }
        };

        it("should create autostart shortcut when openAtLogin is true and shortcut does not exist yet", () => {
            testSetAutostartOptions({
                openAtLogin: true,
                shortcutFileExists: false,
                expectedShortcutOperation: "create",
                expectShortcutFileRemoval: false,
            });
        });

        it("should update autostart shortcut when openAtLogin is true and shortcut already exists", () => {
            testSetAutostartOptions({
                openAtLogin: true,
                shortcutFileExists: true,
                expectedShortcutOperation: "replace",
                expectShortcutFileRemoval: false,
            });
        });

        it("should remove shortcut file when openAtLogin is false and shortcut file exists", () => {
            testSetAutostartOptions({
                openAtLogin: false,
                shortcutFileExists: true,
                expectShortcutFileRemoval: true,
            });
        });

        it("should do nothing when openAtLogin is false and shortcut file does not exist", () => {
            testSetAutostartOptions({
                openAtLogin: false,
                shortcutFileExists: false,
                expectShortcutFileRemoval: false,
            });
        });
    });
});
