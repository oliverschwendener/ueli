import { SearchEngine } from "./search-engine";
import { SearchPlugin } from "./search-plugin";
import { defaultUserConfigOptions } from "../common/config/user-config-options";
import { UserConfigOptions } from "../common/config/user-config-options";
import { englishTranslationSet } from "../common/translation/english-translation-set";
import { FakeSearchPlugin } from "../tests/fake-search-plugin";
import { SearchResultItem } from "../common/search-result-item";
import { PluginType } from "./plugin-type";
import { dummyIcon } from "../tests/dummy-icon";
import { ExecutionPlugin } from "./execution-plugin";
import { TranslationSet } from "../common/translation/translation-set";
import { FakeFavoriteRepository } from "../tests/fake-favorite-repository";

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

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, englishTranslationSet, fakeFavoritesRepository);

        searchEngine.getSearchResults("Google Chrome")
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

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, fakeFavoritesRepository);

        searchEngine.getSearchResults("blabla")
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

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, fakeFavoritesRepository);

        searchEngine.getSearchResults("gOoGlE ChRoMe")
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

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
            searchEngineOptions: {
                fuzzyness: 0.8,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, fakeFavoritesRepository);

        searchEngine.getSearchResults("gglchrm")
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

        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const userConfig = {
            generalOptions: {
                logExecution: false,
            },
            searchEngineOptions: {
                fuzzyness: 0.2,
            },
        } as UserConfigOptions;
        const config = Object.assign({}, defaultUserConfigOptions, userConfig);

        const searchEngine = new SearchEngine(searchPlugins, [], [], config, translationSet, fakeFavoritesRepository);

        searchEngine.getSearchResults("gglchrm")
            .then((searchResults) => {
                expect(searchResults.length).toBe(1);
                expect(searchResults[0].name).toBe(translationSet.noSearchResultsFoundTitle);
                done();
            })
            .catch((err) => done(err));
    });

    it("should list frequently accessed items higher", (done) => {
        const config = {
            generalOptions: {
                logExecution: true,
            },
            searchEngineOptions: {
                fuzzyness: 0.4,
            },
        } as UserConfigOptions;
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
        const searchPlugins: SearchPlugin[] = [
            new FakeSearchPlugin(PluginType.Test, items, true),
        ];
        const executionPlugins: ExecutionPlugin[] = [];
        const fallbackPlugins: ExecutionPlugin[] = [];
        const searchEngine = new SearchEngine(
            searchPlugins,
            executionPlugins,
            fallbackPlugins,
            config,
            translationSet,
            favoritesRepository,
        );
        searchEngine.getSearchResults("a")
            .then((result) => {
                expect(result.length).toBe(4);
                expect(result[0].name).toBe("abcdef");
                done();
            })
            .catch((err) => done(err));
    });
});
