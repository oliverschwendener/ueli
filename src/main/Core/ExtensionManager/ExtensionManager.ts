import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import type { Logger } from "@Core/Logger";
import type { SearchIndex } from "@Core/SearchIndex";
import type { SettingsManager } from "@Core/SettingsManager";
import { createEmptyInstantSearchResult, type InstantSearchResultItems } from "@common/Core";
import type { ScanCounter } from "./ScanCounter";

export class ExtensionManager {
    public constructor(
        private readonly extensionRegistry: ExtensionRegistry,
        private readonly searchIndex: SearchIndex,
        private readonly settingsManager: SettingsManager,
        private readonly logger: Logger,
        private readonly scanCounter: ScanCounter,
    ) {}

    public async populateSearchIndex() {
        const enabledExtensions = this.getEnabledExtensions();

        const promiseResults = await Promise.allSettled(
            enabledExtensions.map((extension) => extension.getSearchResultItems()),
        );

        for (let i = 0; i < enabledExtensions.length; i++) {
            const promiseResult = promiseResults[i];
            const { id: extensionId } = enabledExtensions[i];

            if (promiseResult.status === "fulfilled") {
                this.searchIndex.addSearchResultItems(extensionId, promiseResult.value);
            } else {
                this.logger.error(
                    `Failed to get search result items for extension with id '${extensionId}.` +
                        `Reason: ${promiseResult.reason}'`,
                );
            }
        }

        this.scanCounter.increment();
    }

    public async populateSearchIndexByExtensionId(extensionId: string) {
        const extension = this.extensionRegistry.getById(extensionId);
        const searchResultItems = await extension.getSearchResultItems();
        this.searchIndex.addSearchResultItems(extension.id, searchResultItems);

        this.scanCounter.increment();
    }

    public getSupportedExtensions() {
        return this.extensionRegistry.getAll().filter((extension) => extension.isSupported());
    }

    public getEnabledExtensions() {
        return this.getSupportedExtensions().filter((extension) =>
            this.settingsManager
                .getValue<string[]>("extensions.enabledExtensionIds", ["ApplicationSearch", "UeliCommand"])
                .includes(extension.id),
        );
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        const result: InstantSearchResultItems = createEmptyInstantSearchResult();

        for (const extension of this.getEnabledExtensions()) {
            const instantSearchResultItems: InstantSearchResultItems = extension.getInstantSearchResultItems
                ? extension.getInstantSearchResultItems(searchTerm)
                : createEmptyInstantSearchResult();

            for (const searchResultItem of instantSearchResultItems.after) {
                result.after.push(searchResultItem);
            }

            for (const searchResultItem of instantSearchResultItems.before) {
                result.before.push(searchResultItem);
            }
        }

        return result;
    }
}
