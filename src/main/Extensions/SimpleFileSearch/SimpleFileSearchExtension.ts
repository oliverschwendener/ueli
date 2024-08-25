import { SearchResultItemActionUtility, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { Resources, Translations } from "@common/Core/Translator";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import { basename, join } from "path";

export class SimpleFileSearchExtension implements Extension {
    public readonly id = "SimpleFileSearch";

    public readonly name = "Simple File Search";

    // public readonly nameTranslation?: { key: string; namespace: string };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly logger: Logger,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const folderPaths = ["/Users/oliverschwendener/Downloads"];

        const promiseResults = await Promise.allSettled(
            folderPaths.map((folderPath) => this.fileSystemUtility.readDirectory(folderPath)),
        );

        const searchResultItems: SearchResultItem[] = [];

        for (let i = 0; i < promiseResults.length; i++) {
            const promiseResult = promiseResults[i];
            const folderPath = folderPaths[i];

            if (promiseResult.status === "rejected") {
                this.logger.error(`Failed to read directory. Reason: ${promiseResult.reason}`);
                continue;
            }

            const filePaths = promiseResult.value.map((fileName) => join(folderPath, fileName));
            const images = await this.fileImageGenerator.getImages(filePaths);

            for (const filePath of filePaths) {
                const id = `simple-file-search-${filePath}`;
                searchResultItems.push({
                    id,
                    name: basename(filePath),
                    description: "File or folder",
                    image: images[filePath] ?? this.getImage(),
                    defaultAction: SearchResultItemActionUtility.createOpenFileAction({
                        filePath,
                        description: "Open file",
                    }),
                    additionalActions: [
                        SearchResultItemActionUtility.createAddToFavoritesAction({ id }),
                        SearchResultItemActionUtility.createRemoveFromFavoritesAction({ id }),
                    ],
                });
            }
        }

        return searchResultItems;
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: "",
        };
    }

    public getI18nResources(): Resources<Translations> {
        return {};
    }
}
