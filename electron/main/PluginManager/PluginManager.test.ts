import type { UeliPlugin } from "@common/UeliPlugin";
import { describe, expect, it, vi } from "vitest";
import type { EventSubscriber } from "../EventSubscriber";
import type { PluginDependencies } from "../Plugins";
import type { SettingsManager } from "../Settings";
import { PluginManager } from "./PluginManager";

describe(PluginManager, () => {
    it("should set plugin dependencies for all plugins", () => {
        const setDependenciesMock = vi.fn();
        const pluginDependencies = <PluginDependencies>{};

        new PluginManager(
            [
                <UeliPlugin>{
                    setPluginDependencies: (pluginDependencies) => setDependenciesMock(pluginDependencies),
                },
            ],
            [],
            "Windows",
            <SettingsManager>{},
            <EventSubscriber>{},
        ).setPluginDependencies(pluginDependencies);

        expect(setDependenciesMock).toHaveBeenCalledWith(pluginDependencies);
    });

    it("should return all plugins supported by Windows if current operating system is Windows", () => {
        const plugin = <UeliPlugin>{
            supportedOperatingSystems: ["Windows"],
        };

        const actual = new PluginManager(
            [plugin],
            [],
            "Windows",
            <SettingsManager>{},
            <EventSubscriber>{},
        ).getSupportedPlugins();

        expect(actual).toEqual([plugin]);
    });

    it("should return an empty list if none of the plugins are supported by the current operating system", () => {
        const plugin = <UeliPlugin>{
            supportedOperatingSystems: ["macOS"],
        };

        const actual = new PluginManager(
            [plugin],
            [],
            "Windows",
            <SettingsManager>{},
            <EventSubscriber>{},
        ).getSupportedPlugins();

        expect(actual).toEqual([]);
    });

    it("should return cross platform plugins", () => {
        const plugin = <UeliPlugin>{
            supportedOperatingSystems: ["Windows", "macOS"],
        };

        const actual = new PluginManager(
            [plugin],
            [],
            "Windows",
            <SettingsManager>{},
            <EventSubscriber>{},
        ).getSupportedPlugins();

        expect(actual).toEqual([plugin]);
    });

    it("should subscribe to the 'pluginEnabled' event", () => {
        const subscribeMock = vi.fn();

        new PluginManager(
            [<UeliPlugin>{}],
            [],
            "Windows",
            <SettingsManager>{},
            <EventSubscriber>{
                subscribe: (event, eventHandler) => subscribeMock(event, eventHandler),
            },
        ).subscribeToEvents();

        expect(subscribeMock).toHaveBeenCalledOnce();
    });

    it("should call addSearchResultItemsToSearchIndex of all plugins", () => {
        const addSearchResultItemsToSearchIndexMock1 = vi.fn();
        const addSearchResultItemsToSearchIndexMock2 = vi.fn();
        const getSettingByKeyMock = vi.fn().mockReturnValue(["plugin1"]);

        const plugin1 = <UeliPlugin>{
            id: "plugin1",
            supportedOperatingSystems: ["Windows", "macOS"],
            addSearchResultItemsToSearchIndex: () => addSearchResultItemsToSearchIndexMock1(),
        };

        const plugin2 = <UeliPlugin>{
            id: "plugin2",
            supportedOperatingSystems: ["Windows", "macOS"],
            addSearchResultItemsToSearchIndex: () => addSearchResultItemsToSearchIndexMock2(),
        };

        new PluginManager(
            [plugin1, plugin2],
            [],
            "Windows",
            <SettingsManager>{
                getSettingByKey: (key, defaultValue) => getSettingByKeyMock(key, defaultValue),
            },
            <EventSubscriber>{},
        ).addSearchResultItemsToSearchIndex();

        expect(getSettingByKeyMock).toHaveBeenCalledWith("plugins.enabledPluginIds", []);
        expect(addSearchResultItemsToSearchIndexMock1).toHaveBeenCalledOnce();
        expect(addSearchResultItemsToSearchIndexMock2).not.toHaveBeenCalled();
    });
});
