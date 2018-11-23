import { SearchPluginsSearcher } from "../../../ts/searcher/search-plugins-searcher";
import { UserConfigOptions } from "../../../ts/user-config/user-config-options";
import { CountManager } from "../../../ts/count/count-manager";
import { FakeCountRepository } from "../fake-count-repository";
import { FakeSearchPlugin } from "../fake-search-plugin";
import { FakeSearchPluginManager } from "../../fake-search-plugin-manager";
import { SearchResultItem } from "../../../ts/search-result-item";
import { FakeIconStore } from "../fake-icon-store";

describe(SearchPluginsSearcher.name, (): void => {
    const itemsCount = 5;
    const testConfig = {} as UserConfigOptions;
    const countManager = new CountManager(new FakeCountRepository({}));
    const iconStore = new FakeIconStore();

    const items: SearchResultItem[] = [];
    const searchable = "searchable";

    for (let i = 0; i < itemsCount; i++) {
        items.push({
            description: `description-${i}`,
            executionArgument: `execution-argument-${i}`,
            icon: `icon-${i}`,
            name: `name-${i}`,
            searchable: [searchable],
        });
    }

    const plugins = [
        new FakeSearchPlugin(items),
        new FakeSearchPlugin(items),
        new FakeSearchPlugin(items),
    ];

    describe("getSearchResults", (): void => {
        const searchPluginManager = new FakeSearchPluginManager(plugins);
        const searcher = new SearchPluginsSearcher(testConfig, countManager, searchPluginManager, iconStore);

        it("should return the correct search result", (): void => {
            const actual = searcher.getSearchResult(searchable);
            expect(actual.length).toBe(plugins.length * items.length);
        });
    });

    it("should be able to handle an empty array of plugins", (): void => {
        const searchPluginManager = new FakeSearchPluginManager([]);
        const searcher = new SearchPluginsSearcher(testConfig, countManager, searchPluginManager, iconStore);

        const acutal = searcher.getSearchResult(searchable);
        expect(acutal).not.toBe(undefined);
    });

    it("should not block other searchers", (): void => {
        const searchPluginManager = new FakeSearchPluginManager(plugins);
        const searcher = new SearchPluginsSearcher(testConfig, countManager, searchPluginManager, iconStore);
        const actual = searcher.blockOthers;
        expect(actual).toBe(false);
    });

    it("should initialize the icon store", (): void => {
        const searchPluginManager = new FakeSearchPluginManager(plugins);
        // tslint:disable-next-line:no-unused-expression because the constructor starts the icon store's initialization
        new SearchPluginsSearcher(testConfig, countManager, searchPluginManager, iconStore);
        expect(iconStore.hasBeenInitialized).toBe(true);
    });
});
