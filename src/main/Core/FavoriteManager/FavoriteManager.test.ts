import type { EventEmitter } from "@Core/EventEmitter";
import type { SettingsManager } from "@Core/SettingsManager/SettingsManager";
import type { SearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { FavoriteManager } from "./FavoriteManager";

describe(FavoriteManager, () => {
    it("should get the initial favorites from the settings", async () => {
        const favorites = {
            id1: <SearchResultItem>{
                id: "id1",
                imageUrl: "imageUrl",
                name: "name",
            },
        };

        const getValueMock = vi.fn().mockReturnValue(favorites);
        const settingsManager = <SettingsManager>{ getValue: (k, d) => getValueMock(k, d) };

        const favoriteManager = new FavoriteManager(settingsManager, <EventEmitter>{});

        expect(favoriteManager.favorites).toBe(favorites);
        expect(favoriteManager.getAll()).toEqual(Object.values(favorites));
        expect(getValueMock).toHaveBeenCalledWith("favorites", {});
    });

    it("should add a favorite", async () => {
        const getValueMock = vi.fn().mockReturnValue({});
        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());

        const favorite = <SearchResultItem>{
            id: "favorite1",
            imageUrl: "imageUrl1",
            name: "My Favorite",
        };

        const settingsManager = <SettingsManager>{
            getValue: (k, d) => getValueMock(k, d),
            updateValue: (k, v) => updateValueMock(k, v),
        };

        const emitEventMock = vi.fn();
        const eventEmitter = <EventEmitter>{ emitEvent: (e) => emitEventMock(e) };

        const favoriteManager = new FavoriteManager(settingsManager, eventEmitter);

        await favoriteManager.add(favorite);

        expect(favoriteManager.favorites).toEqual({ favorite1: favorite });
        expect(getValueMock).toHaveBeenCalledWith("favorites", {});
        expect(updateValueMock).toHaveBeenCalledWith("favorites", { favorite1: favorite });
        expect(emitEventMock).toHaveBeenCalledWith("favoritesUpdated");
    });

    it("should remove a favorite", async () => {
        const getValueMock = vi.fn().mockReturnValue({
            id_1: {
                id: "favorite1",
                imageUrl: "imageUrl1",
                name: "My Favorite",
            },
        });
        const updateValueMock = vi.fn().mockReturnValue(Promise.resolve());

        const settingsManager = <SettingsManager>{
            getValue: (k, d) => getValueMock(k, d),
            updateValue: (k, v) => updateValueMock(k, v),
        };

        const emitEventMock = vi.fn();
        const eventEmitter = <EventEmitter>{ emitEvent: (e) => emitEventMock(e) };

        const favoriteManager = new FavoriteManager(settingsManager, eventEmitter);

        await favoriteManager.remove("id_1");

        expect(favoriteManager.favorites).toEqual({});
        expect(getValueMock).toHaveBeenCalledWith("favorites", {});
        expect(updateValueMock).toHaveBeenCalledWith("favorites", {});
        expect(emitEventMock).toHaveBeenCalledWith("favoritesUpdated");
    });
});
