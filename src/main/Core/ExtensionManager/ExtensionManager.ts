import type { ExtensionRegistry } from "@Core/ExtensionRegistry";
import type { Logger } from "@Core/Logger";
import type { SearchIndex } from "@Core/SearchIndex";
import type { SettingsManager } from "@Core/SettingsManager";

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

        for (let i = 0; i < enabledExtensions.length; i++) {
            const promiseResult = promiseResults[i];
            const { id: extensionId } = enabledExtensions[i];

            if (promiseResult.status === "fulfilled") {
                this.searchIndex.addSearchResultItems(extensionId, promiseResult.value);
            } else {
                this.logger.error(
                    `Failed ot get search result items for extension with id '${extensionId}.` +
                        `Reason: ${promiseResult.reason}'`,
                );
            }
        }
    }

    public async populateSearchIndexByExtensionId(extensionId: string) {
        const extension = this.extensionRegistry.getById(extensionId);
        this.searchIndex.addSearchResultItems(extension.id, await extension.getSearchResultItems());
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
}
