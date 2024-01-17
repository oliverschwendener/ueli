import type { DependencyInjector, ExtensionRegistry, Logger, SearchIndex, SettingsManager } from "..";

export class ExtensionManager {
    public constructor(
        private readonly extensionRegistry: ExtensionRegistry,
        private readonly searchIndex: SearchIndex,
        private readonly settingsManager: SettingsManager,
        private readonly logger: Logger,
    ) {}

    public async populateSearchIndex(dependencyInjector: DependencyInjector) {
        const enabledExtensions = this.getEnabledExtensions(dependencyInjector);

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

    public getSupportedExtensions(dependencyInjector: DependencyInjector) {
        return this.extensionRegistry.getAll().filter((extension) => extension.isSupported(dependencyInjector));
    }

    public getEnabledExtensions(dependencyInjector: DependencyInjector) {
        return this.getSupportedExtensions(dependencyInjector).filter((extension) =>
            this.settingsManager
                .getValue<string[]>("extensions.enabledExtensionIds", ["ApplicationSearch", "UeliCommand"])
                .includes(extension.id),
        );
    }
}
