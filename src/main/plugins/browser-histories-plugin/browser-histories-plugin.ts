import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { TranslationSet } from "../../../common/translation/translation-set";
import { BrowserHistory } from "./browser-history";
import { BrowserHistoryOptions } from "../../../common/config/browser-histories-options";
import { BrowserHistoryRepository } from "./browser-history-repository";

export class BrowserHistoriesPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.BrowserHistories;

    private config: BrowserHistoryOptions;
    private translations: TranslationSet;
    private readonly browserHistoryRepositories: BrowserHistoryRepository[];
    private readonly urlExecutor: (url: string) => Promise<void>;
    private browserHistories: BrowserHistory[];

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
        this.browserHistories = [];
    }

    public async getAll(): Promise<SearchResultItem[]> {
        return await this.browserHistories.map((history) => this.buildSearchResultItem(history));
    }

    public async refreshIndex(): Promise<void> {
        const histories = await this.getBrowserHistories();
        this.browserHistories = histories;
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

    private async getBrowserHistories(): Promise<BrowserHistory[]> {
        return this.getMatchingBrowserHistoryRepository().getBrowserHistories();
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

    private buildSearchResultItem(browserHistory: BrowserHistory): SearchResultItem {
        return {
            description: browserHistory.name
                ? browserHistory.url
                : `${this.config.browser} ${this.translations.browserBookmark}`,
            executionArgument: browserHistory.url,
            hideMainWindowAfterExecution: true,
            icon: this.getMatchingBrowserHistoryRepository().defaultIcon,
            name: browserHistory.name || browserHistory.url,
            needsUserConfirmationBeforeExecution: false,
            originPluginType: this.pluginType,
            searchable: [browserHistory.name, browserHistory.url],
        };
    }
}
