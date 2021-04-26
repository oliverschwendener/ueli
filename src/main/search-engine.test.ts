import { SearchEngine } from "./search-engine";
import { SearchPlugin } from "./search-plugin";
import { englishTranslationSet } from "../common/translation/english-translation-set";
import { FakeSearchPlugin } from "../tests/fake-search-plugin";
import { FakeExecutionPlugin } from "../tests/fake-execution-plugin";
import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "./plugin-type";
import { dummyIcon } from "../tests/dummy-icon";
import { ExecutionPlugin } from "./execution-plugin";
import { TranslationSet } from "../common/translation/translation-set";
import { FakeFavoriteRepository } from "../tests/fake-favorite-repository";
import { defaultSearchEngineOptions, SearchEngineOptions } from "../common/config/search-engine-options";

describe(SearchEngine.name, () => {
    const fakeFavoritesRepository = new FakeFavoriteRepository([]);
    it("should find search results when searching for the exact name", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];

        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];

        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            defaultSearchEngineOptions,
            false,
            englishTranslationSet,
            fakeFavoritesRepository,
        );

        searchEngine
            .getSearchResults("Google Chrome")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("should return no search results found when searching for something non-existent", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];

        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            defaultSearchEngineOptions,
            false,
            translationSet,
            fakeFavoritesRepository,
        );

        searchEngine
            .getSearchResults("blabla")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
                done();
            })
            .catch((err) => done(err));
    });

    it("it should be case insensitive", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];

        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            defaultSearchEngineOptions,
            false,
            translationSet,
            fakeFavoritesRepository,
        );

        searchEngine
            .getSearchResults("gOoGlE ChRoMe")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("it should allow inprecise search terms when fuzzyness threshold is higher", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];
        const userOptions = { fuzzyness: 0.8 } as SearchEngineOptions;
        const config = Object.assign({}, defaultSearchEngineOptions, userOptions);

        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            config,
            false,
            translationSet,
            fakeFavoritesRepository,
        );

        searchEngine
            .getSearchResults("gglchrm")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe("Google Chrome");
                done();
            })
            .catch((err) => done(err));
    });

    it("it should require more precise search terms when fuzzyness threshold is lower", (done) => {
        const items: SearchResultItem[] = [
            {
                description: "Google Chrome",
                executionArgument: "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs\\Google Chrome.lnk",
                hideMainWindowAfterExecution: true,
                icon: dummyIcon,
                name: "Google Chrome",
                originPluginType: PluginType.Test,
                searchable: ["Google Chrome"],
            },
        ];
        const translationSet = englishTranslationSet;

        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];
        const userOptions = { fuzzyness: 0.2 } as SearchEngineOptions;
        const config = Object.assign({}, defaultSearchEngineOptions, userOptions);

        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            config,
            false,
            translationSet,
            fakeFavoritesRepository,
        );

        searchEngine
            .getSearchResults("gglchrm")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
                done();
            })
            .catch((err) => done(err));
    });

    it("should list frequently accessed items higher", (done) => {
        const logExecution = true;
        const translationSet = {} as TranslationSet;
        const items = [
            { name: "abc", executionArgument: "abc", searchable: ["abc"] },
            { name: "abcd", executionArgument: "abcd", searchable: ["abcd"] },
            { name: "abcde", executionArgument: "abcde", searchable: ["abcde"] },
            { name: "abcdef", executionArgument: "abcdef", searchable: ["abcdef"] },
        ] as SearchResultItem[];
        const favoritesRepository = new FakeFavoriteRepository([
            { executionCount: 0, item: items[0] },
            { executionCount: 0, item: items[1] },
            { executionCount: 0, item: items[2] },
            { executionCount: 10, item: items[3] },
        ]);
        const searchPlugins: SearchPlugin[] = [new FakeSearchPlugin(PluginType.Test, items, true)];
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            defaultSearchEngineOptions,
            logExecution,
            translationSet,
            favoritesRepository,
        );
        searchEngine
            .getSearchResults("a")
            .then((result) => {
                expect(result.length).toBe(4);
                expect(result[0].name).toBe("abcdef");
                done();
            })
            .catch((err) => done(err));
    });

    it("should only refresh indexes of enabled plugins", (done) => {
        const translationSet = {} as TranslationSet;
        const favoritesRepository = new FakeFavoriteRepository([]);
        const fakePlugins = [
            new FakeSearchPlugin(PluginType.Test, [], true),
            new FakeSearchPlugin(PluginType.Test, [], true),
            new FakeSearchPlugin(PluginType.Test, [], false),
            new FakeSearchPlugin(PluginType.Test, [], false),
        ];
        const searchPlugins: SearchPlugin[] = fakePlugins;
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            defaultSearchEngineOptions,
            false,
            translationSet,
            favoritesRepository,
        );

        searchEngine
            .refreshAllIndexes()
            .then(() => {
                const refreshedPlugins = fakePlugins.filter((plugin) => plugin.getIndexRefreshCount() > 0);
                const enabledPlugins = fakePlugins.filter((plugin) => plugin.isEnabled());
                expect(refreshedPlugins.length).toBe(enabledPlugins.length);
                done();
            })
            .catch((err) => done(err));
    });

    it("should only refresh index of given plugin", (done) => {
        const translationSet = {} as TranslationSet;
        const favoritesRepository = new FakeFavoriteRepository([]);
        const fakePlugins = [
            new FakeSearchPlugin(PluginType.Test, [], true),
            new FakeSearchPlugin(PluginType.ApplicationSearchPlugin, [], true),
            new FakeSearchPlugin(PluginType.Commandline, [], false),
            new FakeSearchPlugin(PluginType.CurrencyConverter, [], false),
        ];
        const searchPlugins: SearchPlugin[] = fakePlugins;
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            defaultSearchEngineOptions,
            false,
            translationSet,
            favoritesRepository,
        );

        searchEngine
            .refreshIndexByPlugin(PluginType.Test)
            .then(() => {
                const refreshedPlugins = fakePlugins.filter((plugin) => plugin.getIndexRefreshCount() > 0);
                expect(refreshedPlugins.length).toBe(1);
                refreshedPlugins.forEach((plugin) => {
                    expect(plugin.pluginType.toString()).toBe(PluginType.Test.toString());
                });
                done();
            })
            .catch((err) => done(err));
    });

    it("should only search entries of enabled plugins", (done) => {
        const translationSet = {} as TranslationSet;
        const items = [
            { name: "abc", executionArgument: "abc", searchable: ["abc"] },
            { name: "abcd", executionArgument: "abcd", searchable: ["abcd"] },
            { name: "abcde", executionArgument: "abcde", searchable: ["abcde"] },
        ] as SearchResultItem[];
        const favoritesRepository = new FakeFavoriteRepository([]);
        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
            new FakeSearchPlugin(PluginType.Test, items, true),
            new FakeSearchPlugin(PluginType.Test, items, false),
            new FakeSearchPlugin(PluginType.Test, items, false),
        ];
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            defaultSearchEngineOptions,
            false,
            translationSet,
            favoritesRepository,
        );

        searchEngine
            .getSearchResults("abc")
            .then((searchResultItems) => {
                const actual = searchResultItems.length;
                const expected = searchPlugins.filter((plugin) => plugin.isEnabled()).length * items.length;
                expect(actual).toBe(expected);
                done();
            })
            .catch((err) => done(err));
    });

    it("should filter out blacklist entries of search plugin items", (done) => {
        const translationSet = {} as TranslationSet;
        const blackList = ["abcde"];
        const userOptions = { blackList } as SearchEngineOptions;

        const config = Object.assign({}, defaultSearchEngineOptions, userOptions);

        const items = [
            { name: "abc", searchable: ["abc"] },
            { name: "abcd", searchable: ["abcd"] },
            { name: "abcde", searchable: ["abcde"] },
            { name: "abcdef", searchable: ["abcdef"] },
            { name: "abcdefg", searchable: ["abcdefg"] },
        ] as SearchResultItem[];

        const favoritesRepository = new FakeFavoriteRepository([]);
        const searchPlugins = [new FakeSearchPlugin(PluginType.Test, items, true)];
        const searchEngine = new SearchEngine(
            searchPlugins,
            [],
            [],
            config,
            false,
            translationSet,
            favoritesRepository,
        );

        searchEngine
            .getSearchResults("abc")
            .then((results) => {
                expect(results.length).toBe(2);
                done();
            })
            .catch((err) => done(err));
    });

    it("should not filter out blacklist entries of execution plugin items", (done) => {
        const translationSet = {} as TranslationSet;
        const blackList = ["abc"];
        const userOptions = { blackList } as SearchEngineOptions;

        const config = Object.assign({}, defaultSearchEngineOptions, userOptions);

        const items = [
            { name: "abc", searchable: ["abc"] },
            { name: "abcd", searchable: ["abcd"] },
            { name: "abcde", searchable: ["abcde"] },
            { name: "abcdef", searchable: ["abcdef"] },
            { name: "abcdefg", searchable: ["abcdefg"] },
        ] as SearchResultItem[];

        const favoritesRepository = new FakeFavoriteRepository([]);
        const executionPlugins = [new FakeExecutionPlugin(true, true, items)];
        const searchEngine = new SearchEngine(
            [],
            executionPlugins,
            [],
            config,
            false,
            translationSet,
            favoritesRepository,
        );

        searchEngine
            .getSearchResults("abc")
            .then((results) => {
                expect(results.length).toBe(items.length);
                done();
            })
            .catch((err) => done(err));
    });
});
