import type { BrowserWindowNotifier } from "@Core/BrowserWindowNotifier";
import type { SettingsManager } from "@Core/SettingsManager/SettingsManager";
import { describe, expect, it, vi } from "vitest";
import { FavoriteManager } from "./FavoriteManager";

describe(FavoriteManager, () => {
    it("should get the initial favorites from the settings", async () => {
        const favorites = ["id_1", "id_2"];

        const getValueMock = vi.fn().mockReturnValue(favorites);
        const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

        const favoriteManager = new FavoriteManager(settingsManager, <BrowserWindowNotifier>{});

        expect(favoriteManager.favorites).toBe(favorites);
        expect(favoriteManager.getAll()).toEqual(Object.values(favorites));
        expect(getValueMock).toHaveBeenCalledWith("favorites", []);
    });

    it("should add a favorite", async () => {
        const getValueMock = vi.fn().mockReturnValue([]);
        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());

        const settingsManager = <SettingsManager>{
            getValue: (k, d) => getValueMock(k, d),
            updateValue: (k, v) => updateValueMock(k, v),
        };

        const notifyAllMock = vi.fn();
        const browserWindowNotifier = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

        const favoriteManager = new FavoriteManager(settingsManager, browserWindowNotifier);

        await favoriteManager.add("id_1");

        expect(favoriteManager.favorites).toEqual(["id_1"]);
        expect(getValueMock).toHaveBeenCalledWith("favorites", []);
        expect(updateValueMock).toHaveBeenCalledWith("favorites", ["id_1"]);
        expect(notifyAllMock).toHaveBeenCalledWith({ channel: "favoritesUpdated" });
    });

    it("should remove a favorite", async () => {
        const getValueMock = vi.fn().mockReturnValue(["id_1"]);
        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());

        const settingsManager = <SettingsManager>{
            getValue: (k, d) => getValueMock(k, d),
            updateValue: (k, v) => updateValueMock(k, v),
        };

        const notifyAllMock = vi.fn();
        const eventEmitter = <BrowserWindowNotifier>{ notifyAll: (a) => notifyAllMock(a) };

        const favoriteManager = new FavoriteManager(settingsManager, eventEmitter);

        await favoriteManager.remove("id_1");

        expect(favoriteManager.favorites).toEqual([]);
        expect(getValueMock).toHaveBeenCalledWith("favorites", []);
        expect(updateValueMock).toHaveBeenCalledWith("favorites", []);
        expect(notifyAllMock).toHaveBeenCalledWith({ channel: "favoritesUpdated" });
    });
});
