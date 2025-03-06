import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";
import { SettingsFilePathResolver } from "./SettingsFilePathResolver";
import type { SettingsFilePathSource } from "./SettingsFilePathSource";

describe(SettingsFilePathResolver, () => {
    describe(SettingsFilePathResolver.prototype.resolve, () => {
        const infoMock = vi.fn();

        const logger = <Logger>{ info: (message) => infoMock(message) };

        it("should return the result of the first source that returns a file path", () => {
            const sources = [
                <SettingsFilePathSource>{ getSettingsFilePath: () => undefined },
                <SettingsFilePathSource>{ getSettingsFilePath: () => "file path 2" },
                <SettingsFilePathSource>{ getSettingsFilePath: () => undefined },
                <SettingsFilePathSource>{ getSettingsFilePath: () => "file path 4" },
            ];

            expect(new SettingsFilePathResolver(sources, logger).resolve()).toBe("file path 2");
        });

        it("should throw an error if none of the sources returns a file path", () => {
            const sources = [
                <SettingsFilePathSource>{ getSettingsFilePath: () => undefined },
                <SettingsFilePathSource>{ getSettingsFilePath: () => undefined },
                <SettingsFilePathSource>{ getSettingsFilePath: () => undefined },
            ];

            expect(() => new SettingsFilePathResolver(sources, logger).resolve()).toThrowError(
                "Could not resolve settings file path",
            );
        });
    });
});
