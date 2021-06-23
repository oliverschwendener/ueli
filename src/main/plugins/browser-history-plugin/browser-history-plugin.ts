import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { BrowserHistoryEntry } from "./browser-history-entry";
import { BrowserHistoryOptions } from "../../../common/config/browser-history-options";
import { BrowserHistoryRepository } from "./browser-history-repository";

export class BrowserHistoryPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.BrowserHistory;

    private config: BrowserHistoryOptions;
    private translations: TranslationSet;
    private readonly browserHistoryRepositories: BrowserHistoryRepository[];
    private readonly urlExecutor: (url: string) => Promise<void>;
    private browserHistory: BrowserHistoryEntry[];

    constructor(
        config: BrowserHistoryOptions,
        translations: TranslationSet,
        browserHistoryRepositories: BrowserHistoryRepository[],
        urlExecutor: (url: string) => Promise<void>,
    ) {
        this.config = config;
        this.translations = translations;
        this.browserHistoryRepositories = browserHistoryRepositories;
        this.urlExecutor = urlExecutor;
        this.browserHistory = [];
    }

    public async getAll(): Promise<SearchResultItem[]> {
        return await this.browserHistory.map((history) => this.buildSearchResultItem(history));
    }

    public async refreshIndex(): Promise<void> {
        const history = await this.getBrowserHistory();
        this.browserHistory = history;
    }

    public async clearCache(): Promise<void> {
        return new Promise((resolve) => resolve());
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return this.urlExecutor(searchResultItem.executionArgument);
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve, reject) => {
            this.translations = translationSet;

            const browserChanged = updatedConfig.browserBookmarksOptions.browser !== this.config.browser;

            if (browserChanged) {
                this.config = updatedConfig.browserBookmarksOptions;
                this.refreshIndex()
                    .then(() => resolve())
                    .catch((err) => reject(err));
            } else {
                this.config = updatedConfig.browserBookmarksOptions;
                resolve();
            }
        });
    }

    private async getBrowserHistory(): Promise<BrowserHistoryEntry[]> {
        return this.getMatchingBrowserHistoryRepository().getBrowserHistory();
    }

    private getMatchingBrowserHistoryRepository(): BrowserHistoryRepository {
        const matchingHistoryRepository = this.browserHistoryRepositories.find(
            (historyRepository) => historyRepository.browser === this.config.browser,
        );
        if (matchingHistoryRepository) {
            return matchingHistoryRepository;
        }
        throw new Error(`Unsupported browser: ${this.config.browser}`);
    }

    private buildSearchResultItem(browserHistoryEntry: BrowserHistoryEntry): SearchResultItem {
        return {
            description: browserHistoryEntry.name
                ? browserHistoryEntry.url
                : `${this.config.browser} ${this.translations.browserBookmark}`,
            executionArgument: browserHistoryEntry.url,
            hideMainWindowAfterExecution: true,
            icon: this.getMatchingBrowserHistoryRepository().defaultIcon,
            name: browserHistoryEntry.name || browserHistoryEntry.url,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [browserHistoryEntry.name, browserHistoryEntry.url],
        };
    }
}
