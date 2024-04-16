import type { App } from "electron";
import { join } from "path";
import { describe, expect, it, vi } from "vitest";
import { resolveChromiumBookmarksFilePath } from "./resolveChromiumBookmarksFilePath";

describe(resolveChromiumBookmarksFilePath, () => {
    const getPathMock = vi.fn();
    const app = <App>{ getPath: (p) => getPathMock(p) };

    it("should return the correct file path on Windows for Google Chrome", () => {
        getPathMock.mockImplementationOnce(() => "home");

        expect(resolveChromiumBookmarksFilePath({ browser: "Google Chrome", app, operatingSystem: "Windows" })).toBe(
            join("home", "AppData", "Local", "Google", "Chrome", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("home");
    });

    it("should return the correct file path on macOS for Google Chrome", () => {
        getPathMock.mockImplementationOnce(() => "appData");

        expect(resolveChromiumBookmarksFilePath({ browser: "Google Chrome", app, operatingSystem: "macOS" })).toBe(
            join("appData", "Google", "Chrome", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("appData");
    });

    it("should return the correct file path on Windows for Microsoft Edge", () => {
        getPathMock.mockImplementationOnce(() => "home");

        expect(resolveChromiumBookmarksFilePath({ browser: "Microsoft Edge", app, operatingSystem: "Windows" })).toBe(
            join("home", "AppData", "Local", "Microsoft", "Edge", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("home");
    });

    it("should return the correct file path on macOS for Microsoft Edge", () => {
        getPathMock.mockImplementationOnce(() => "appData");

        expect(resolveChromiumBookmarksFilePath({ browser: "Microsoft Edge", app, operatingSystem: "macOS" })).toBe(
            join("appData", "Microsoft Edge", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("appData");
    });

    it("should return the correct file path on Windows for Brave Browser", () => {
        getPathMock.mockImplementationOnce(() => "home");

        expect(resolveChromiumBookmarksFilePath({ browser: "Brave Browser", app, operatingSystem: "Windows" })).toBe(
            join("home", "AppData", "Local", "BraveSoftware", "Brave-Browser", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("home");
    });

    it("should return the correct file path on macOS for Brave Browser", () => {
        getPathMock.mockImplementationOnce(() => "appData");

        expect(resolveChromiumBookmarksFilePath({ browser: "Brave Browser", app, operatingSystem: "macOS" })).toBe(
            join("appData", "BraveSoftware", "Brave-Browser", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("appData");
    });

    it("should return the correct file path on Windows for Yandex Browser", () => {
        getPathMock.mockImplementationOnce(() => "home");

        expect(resolveChromiumBookmarksFilePath({ browser: "Yandex Browser", app, operatingSystem: "Windows" })).toBe(
            join("home", "AppData", "Local", "Yandex", "YandexBrowser", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("home");
    });

    it("should return the correct file path on macOS for Yandex Browser", () => {
        getPathMock.mockImplementationOnce(() => "appData");

        expect(resolveChromiumBookmarksFilePath({ browser: "Yandex Browser", app, operatingSystem: "macOS" })).toBe(
            join("appData", "Yandex", "YandexBrowser", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("appData");
    });

    it("should return the correct file path on Windows for Arc", () => {
        getPathMock.mockImplementationOnce(() => "home");

        expect(resolveChromiumBookmarksFilePath({ browser: "Arc", app, operatingSystem: "Windows" })).toBe(
            join("home", "AppData", "Local", "Arc", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("home");
    });

    it("should return the correct file path on macOS for Arc", () => {
        getPathMock.mockImplementationOnce(() => "appData");

        expect(resolveChromiumBookmarksFilePath({ browser: "Arc", app, operatingSystem: "macOS" })).toBe(
            join("appData", "Arc", "User Data", "Default", "Bookmarks"),
        );

        expect(getPathMock).toHaveBeenCalledWith("appData");
    });
});
