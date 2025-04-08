import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { App } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { CustomSettingsFilePathResolver } from "./CustomSettingsFilePathResolver";

describe(CustomSettingsFilePathResolver, () => {
    const createCustomSettingsFilePathResolver = ({
        homePath,
        configFileExists,
        config,
    }: {
        homePath: string;
        configFileExists: boolean;
        config: Record<string, string>;
    }) => {
        const getPathMock = vi.fn().mockReturnValue(homePath);
        const existsSyncMock = vi.fn().mockReturnValue(configFileExists);
        const readJsonFileSyncMock = vi.fn().mockReturnValue(config);
        const writeJsonFileMock = vi.fn();
        const writeJsonFileSyncMock = vi.fn();

        const app = <App>{ getPath: (n) => getPathMock(n) };

        const fileSystemUtility = <FileSystemUtility>{
            existsSync: (f) => existsSyncMock(f),
            readJsonFileSync: (f) => readJsonFileSyncMock(f),
            writeJsonFile: (d, f) => writeJsonFileMock(d, f),
            writeJsonFileSync: (d, f) => writeJsonFileSyncMock(d, f),
        };

        const customSettingsFilePathResolver = new CustomSettingsFilePathResolver(app, fileSystemUtility);

        return {
            customSettingsFilePathResolver,
            getPathMock,
            existsSyncMock,
            readJsonFileSyncMock,
            writeJsonFileMock,
            writeJsonFileSyncMock,
        };
    };

    describe(CustomSettingsFilePathResolver.prototype.isEnabled, () => {
        it("should return false if config file does not exist", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: false,
                });

            expect(customSettingsFilePathResolver.isEnabled()).toBe(false);

            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });

        it("should return false if config file exists but doesnt have a settingsFilePath property", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: true,
                });

            expect(customSettingsFilePathResolver.isEnabled()).toBe(false);

            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });

        it("should return true if config file exists and has a settingsFilePath property", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock, readJsonFileSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: { settingsFilePath: "my-custon-settings-file.json" },
                    configFileExists: true,
                });

            expect(customSettingsFilePathResolver.isEnabled()).toBe(true);

            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });
    });

    describe(CustomSettingsFilePathResolver.prototype.remove, () => {
        it("should write the new settings file path to the config file", async () => {
            const { customSettingsFilePathResolver, readJsonFileSyncMock, writeJsonFileSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: { settingsFilePath: "old-file.json" },
                    configFileExists: true,
                });

            await customSettingsFilePathResolver.remove();

            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
            expect(writeJsonFileSyncMock).toHaveBeenCalledWith({}, join("home", "ueli9.config.json"));
        });

        it("should do nothing if the current settings dont have a settingsFilePath property", async () => {
            const { customSettingsFilePathResolver, readJsonFileSyncMock, writeJsonFileSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: true,
                });

            await customSettingsFilePathResolver.remove();

            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
            expect(writeJsonFileSyncMock).toHaveBeenCalledWith({}, join("home", "ueli9.config.json"));
        });
    });

    describe(CustomSettingsFilePathResolver.prototype.resolve, () => {
        it("should return undefined if config file does not exist", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: false,
                });

            expect(customSettingsFilePathResolver.resolve()).toBe(undefined);
            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });

        it("should return undefined if config file exists but doesnt have a settingsFilePath property", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: true,
                });

            expect(customSettingsFilePathResolver.resolve()).toBe(undefined);
            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });

        it("should return the settingsFilePath if config file exists and has a settingsFilePath property", () => {
            const { customSettingsFilePathResolver, getPathMock, existsSyncMock, readJsonFileSyncMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: { settingsFilePath: "myCustomConfigFile.json" },
                    configFileExists: true,
                });

            expect(customSettingsFilePathResolver.resolve()).toBe("myCustomConfigFile.json");
            expect(getPathMock).toHaveBeenCalledWith("home");
            expect(existsSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));
        });
    });

    describe(CustomSettingsFilePathResolver.prototype.writeFilePathToConfigFile, () => {
        it("should update the existing settingsFilePath in the config file", async () => {
            const { customSettingsFilePathResolver, readJsonFileSyncMock, writeJsonFileMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: { settingsFilePath: "old-file.json" },
                    configFileExists: true,
                });

            await customSettingsFilePathResolver.writeFilePathToConfigFile("new-file.json");

            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));

            expect(writeJsonFileMock).toHaveBeenCalledWith(
                { settingsFilePath: "new-file.json" },
                join("home", "ueli9.config.json"),
            );
        });

        it("should add the the new settingsFilePath to the config file if it the property is not there yet", async () => {
            const { customSettingsFilePathResolver, readJsonFileSyncMock, writeJsonFileMock } =
                createCustomSettingsFilePathResolver({
                    homePath: "home",
                    config: {},
                    configFileExists: true,
                });

            await customSettingsFilePathResolver.writeFilePathToConfigFile("new-file.json");

            expect(readJsonFileSyncMock).toHaveBeenCalledWith(join("home", "ueli9.config.json"));

            expect(writeJsonFileMock).toHaveBeenCalledWith(
                { settingsFilePath: "new-file.json" },
                join("home", "ueli9.config.json"),
            );
        });
    });
});
