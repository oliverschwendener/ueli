import { isValidJson, mergeUserConfigWithDefault } from "./config-helpers";
import { UserConfigOptions } from "../config/user-config-options";
import { TranslationLanguage } from "../../main/plugins/translation-plugin/translation-language";
import { GlobalHotKeyKey } from "../global-hot-key/global-hot-key-key";
import { GlobalHotKeyModifier } from "../global-hot-key/global-hot-key-modifier";
import { Language } from "../translation/language";
import { Browser } from "../../main/plugins/browser-bookmarks-plugin/browser";
import { TemperatureUnit } from "../../main/plugins/weather-plugin/weather-temperature-unit";
import { MacOsShell } from "../../main/plugins/commandline-plugin/shells";
import { CurrencyCode } from "../../main/plugins/currency-converter-plugin/currency-code";

const defaultUserConfigOptions: UserConfigOptions = {
    appearanceOptions: {
        allowTransparentBackground: false,
        fontFamily: "Segoe UI",
        maxSearchResultsPerPage: 8,
        searchResultHeight: 50,
        showDescriptionOnAllSearchResults: true,
        showSearchIcon: true,
        showSearchResultNumbers: false,
        smoothScrolling: true,
        userInputHeight: 60,
        windowWidth: 600,
        userInputBorderRadius: "0px",
        userInputFontSize: "24px",
        userInputFontWeight: "200",
        userInputBottomMargin: 0,
        searchResultNameFontSize: "16px",
        searchResultNameFontWeight: "400",
        searchResultDescriptionFontSize: "12px",
        searchResultDescriptionFontWeight: "200",
        searchResultsBorderRadius: "0px",
        scrollbarBorderRadius: "0px",
    },
    colorThemeOptions: {
        name: "Atom One Dark",
        userInputBackgroundColor: "#20252b",
        userInputTextColor: "#fff",
        searchResultsBackgroundColor: "#272c34",
        searchResultsItemActiveBackgroundColor: "#3d4452",
        searchResultsItemActiveDescriptionColor: "#fff",
        searchResultsItemActiveTextColor: "#fff",
        searchResultsItemDescriptionTextColor: "#ccc",
        searchResultsItemNameTextcolor: "#aab2c0",
        scrollbarBackgroundColor: "#1f2328",
        scrollbarForegroundColor: "#3d444f",
    },
    applicationSearchOptions: {
        applicationFileExtensions: [".app"],
        applicationFolders: [
            "/Applications",
            "/System/Library/CoreServices",
            "/System/Applications",
            `/Users/oschwend/Applications`,
        ],
        enabled: true,
        showFullFilePath: false,
        useNativeIcons: true,
    },
    everythingSearchOptions: {
        enabled: false,
        maxSearchResults: 24,
        pathToEs: "C:\\es\\es.exe",
        prefix: "es?",
    },
    dictionaryOptions: {
        debounceDelay: 250,
        isEnabled: true,
        minSearchTermLength: 3,
        prefix: "dict?",
    },
    mdfindOptions: {
        debounceDelay: 250,
        enabled: false,
        maxSearchResults: 24,
        prefix: "md?",
    },
    searchEngineOptions: {
        blackList: [],
        fuzzyness: 0.5,
        maxSearchResults: 24,
    },
    shortcutOptions: {
        isEnabled: false,
        shortcuts: [],
    },
    translationOptions: {
        debounceDelay: 250,
        enabled: false,
        minSearchTermLength: 3,
        prefix: "t?",
        sourceLanguage: TranslationLanguage.German,
        targetLanguage: TranslationLanguage.English,
    },
    generalOptions: {
        allowWindowMove: true,
        autostart: true,
        clearCachesOnExit: false,
        hideMainWindowAfterExecution: true,
        hideMainWindowOnBlur: true,
        hotKey: {
            key: GlobalHotKeyKey.Space,
            modifier: GlobalHotKeyModifier.Alt,
            secondModifier: GlobalHotKeyModifier.None,
        },
        language: Language.English,
        logExecution: true,
        persistentUserInput: false,
        rememberWindowPosition: false,
        rescanEnabled: true,
        rescanIntervalInSeconds: 300,
        showAlwaysOnPrimaryDisplay: false,
        showTrayIcon: true,
        decimalSeparator: ".",
    },
    websearchOptions: {
        isEnabled: false,
        webSearchEngines: [],
    },
    fileBrowserOptions: {
        blackList: ["desktop.ini"],
        isEnabled: false,
        maxSearchResults: 100,
        showFullFilePath: true,
        showHiddenFiles: false,
    },
    operatingSystemCommandsOptions: {
        isEnabled: false,
    },
    operatingSystemSettingsOptions: {
        isEnabled: false,
    },
    calculatorOptions: {
        isEnabled: true,
        precision: 16,
    },
    urlOptions: {
        defaultProtocol: "https",
        isEnabled: true,
    },
    emailOptions: {
        isEnabled: false,
    },
    currencyConverterOptions: {
        isEnabled: false,
        precision: 2,
        defaultTarget: CurrencyCode.EUR,
    },
    workflowOptions: {
        isEnabled: false,
        workflows: [],
    },
    commandlineOptions: {
        isEnabled: true,
        prefix: ">",
        shell: MacOsShell.Terminal,
    },
    simpleFolderSearchOptions: {
        folders: [
            {
                excludeHiddenFiles: true,
                folderPath: "/Users/oschwend",
                recursive: false,
            },
        ],
        isEnabled: true,
        showFullFilePath: true,
    },
    colorConverterOptions: {
        hexEnabled: true,
        hslEnabled: true,
        isEnabled: true,
        rgbEnabled: true,
        rgbaEnabled: true,
        showColorPreview: false,
    },
    uwpSearchOptions: {
        isEnabled: false,
    },
    browserBookmarksOptions: {
        browser: Browser.Brave,
        isEnabled: false,
    },
    controlPanelOptions: {
        isEnabled: false,
    },
    weatherOptions: {
        isEnabled: false,
        prefix: "weather",
        temperatureUnit: TemperatureUnit.Celsius,
    },
    loremIpsumOptions: {
        isEnabled: false,
        prefix: "lorem",
    },
};

describe(isValidJson.name, () => {
    it("should return true if valid json is passed in", () => {
        const validElements = [
            {},
            [],
            {
                property: "my-property",
                property2: 2,
                property3: true,
            },
            "undefined",
            "null",
        ];

        validElements.forEach((validElement) => {
            const actual = isValidJson(JSON.stringify(validElement));
            expect(actual).toBe(true);
        });
    });

    it("should return false if invalid json is passed in", () => {
        const invalidElements = ["blabla", "{'1kc$$asdf90c"];

        invalidElements.forEach((invalidElement) => {
            const actual = isValidJson(invalidElement);
            expect(actual).toBe(false);
        });
    });
});

describe(mergeUserConfigWithDefault.name, () => {
    it("should not modify default config when passing in an empty object", () => {
        const object = {};
        const actual = mergeUserConfigWithDefault(object, defaultUserConfigOptions);
        expect(JSON.stringify(actual)).toBe(JSON.stringify(defaultUserConfigOptions));
    });

    it("should apply the passed object to the default config", () => {
        const object = {
            urlOptions: {
                defaultProtocol: "ftp",
            },
        } as UserConfigOptions;

        const actual = mergeUserConfigWithDefault(object, defaultUserConfigOptions);
        expect(actual.urlOptions.defaultProtocol).toBe("ftp");
        expect(actual.fileBrowserOptions.maxSearchResults).toBe(
            defaultUserConfigOptions.fileBrowserOptions.maxSearchResults,
        );
    });
});
