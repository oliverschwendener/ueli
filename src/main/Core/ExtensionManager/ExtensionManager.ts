import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import type { Logger } from "@Core/Logger";
import type { Index, SearchIndex } from "@Core/SearchIndex";
import type { SettingsManager } from "@Core/SettingsManager";
import { createEmptyInstantSearchResult, type InstantSearchResultItems } from "@common/Core";

export class ExtensionManager {
    public constructor(
        private readonly extensionRegistry: ExtensionRegistry,
        private readonly searchIndex: SearchIndex,
        private readonly settingsManager: SettingsManager,
        private readonly logger: Logger,
    ) {}

    public async populateSearchIndex() {
        const enabledExtensions = this.getEnabledExtensions();

        const promiseResults = await Promise.allSettled(
            enabledExtensions.map((extension) => extension.getSearchResultItems()),
        );

        const newIndex: Index = {};

        for (let i = 0; i < enabledExtensions.length; i++) {
            const promiseResult = promiseResults[i];
            const { id: extensionId } = enabledExtensions[i];

            if (promiseResult.status === "fulfilled") {
                newIndex[extensionId] = promiseResult.value;
            } else {
                this.logger.error(
                    `Failed to get search result items for extension with id '${extensionId}.` +
                        `Reason: ${promiseResult.reason}'`,
                );
            }
        }

        this.searchIndex.set(newIndex);
    }

    public async populateSearchIndexByExtensionId(extensionId: string) {
        const extension = this.extensionRegistry.getById(extensionId);
        const searchResultItems = await extension.getSearchResultItems();
        this.searchIndex.addSearchResultItems(extension.id, searchResultItems);
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
            let instantSearchResultItems: InstantSearchResultItems = createEmptyInstantSearchResult();

            try {
                instantSearchResultItems = extension.getInstantSearchResultItems
                    ? extension.getInstantSearchResultItems(searchTerm)
                    : createEmptyInstantSearchResult();
            } catch (error) {
                this.logger.error(`Error evaluating extension with id '${extension.id}': ${error}`);
            }

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
