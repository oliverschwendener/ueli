import type { InstantSearchResultItems, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";

/**
 * Represents an Extension. Implement this interface to create a custom Extension.
 *
 * The constructor for every extension is called once when the application is started, so make sure to keep it empty or
 * do only lightweight operations in it.
 */
export interface Extension {
    /**
     * A unique identifier for this Extension, e.g. `"MyCustomExtension"`.
     */
    readonly id: string;

    /**
     * The name of this Extension, e.g. `"My Custom Extension"`.
     */
    readonly name: string;

    /**
     * The optional translation of the name of this Extension. If given, this will be used instead of the name.
     * The namespace must be of this format: `extension[<EXTENSION_ID>]`.
     */
    readonly nameTranslation?: {
        key: string;
        namespace: string;
    };

    /**
     * The author of this Extension. This is used to display the author's name and GitHub username in the settings.
     */
    readonly author: {
        name: string;
        githubUserName: string;
    };

    /**
     * Gets the search result items for this Extension. The result of this method is put into a global search index and
     * can be searched in the search result list. This method is called when the application is started, when settings
     * are changed or when triggering a rescan via the UI. As this method is asynchronous, heavier operations like
     * fetching APIs or scanning the file system can go here.
     */
    getSearchResultItems(): Promise<SearchResultItem[]>;

    /**
     * Determines if this Extension is supported on the current system. Unsupported extensions are not being searched.
     */
    isSupported(): boolean;

    /**
     * Gets the default value for a setting of this Extension.
     * @param key The key of the setting, e.g. `"mySetting"`.
     * @returns The default value for the setting.
     */
    getSettingDefaultValue(key: string): unknown;

    /**
     * Gets the image for this Extension. This image is displayed in the settings.
     */
    getImage(): Image;

    /**
     * Gets the translations for this Extension. The translations are used to translate the name and description of the
     * extension. You can access these translations in the renderer process with the namespace
     * `extension[<EXTENSION_ID>]`.
     */
    getI18nResources(): Resources<Translations>;

    /**
     * Gets the instant search result items for this Extension. The results of this method are displayed immediately in
     * the search result list. As this method is executed on every user input change, it should be as lightweight as
     * possible. For heavier operations use `getSearchResultItems`.
     * @param searchTerm The current search term.
     */
    getInstantSearchResultItems?(searchTerm: string): InstantSearchResultItems;

    /**
     * If you have a custom UI for your extension you can call it via `contextBridge.invokeExtension(arg)` with any
     * argument.
     */
    invoke?(argument: unknown): Promise<unknown>;

    /**
     * This method allows you to fetch asset file paths for your extension. This is useful for example if you want to
     * display images in your custom UI or in your extension settings UI.
     */
    getAssetFilePath?(key: string): string;

    /**
     * This method defines the setting keys that trigger a rescan of this extension. If your search result items depend
     * on settings of your extension, you can specify the keys of these settings here, so that on a change your search
     * result items are updated in the search index.
     */
    getSettingKeysTriggeringRescan?(): string[];
}
