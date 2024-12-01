import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FluentIcon, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";

type Settings = {
    confirmBeforeEmpty: boolean;
};

export class EmptyTrashExtension implements Extension {
    public readonly id = "EmptyTrash";
    public readonly name = "Empty Trash";

    public readonly nameTranslation = {
        key: "Empty Trash",
        namespace: "extension[EmptyTrash]",
    };

    private readonly defaultSettings: Settings = {
        confirmBeforeEmpty: true,
    };

    public readonly author = {
        name: "Ömer Duran",
        githubUserName: "omerdduran",
    };

    public constructor(private readonly assetPathResolver: AssetPathResolver) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        return [
            {
                name: "Empty Trash",
                description: "Empty system trash/recycle bin",
                descriptionTranslation: {
                    key: "emptyTrashDescription",
                    namespace: "extension[EmptyTrash]",
                },
                id: "emptyTrash:action",
                image: this.getImage(),
                defaultAction: {
                    description: "Empty trash",
                    descriptionTranslation: {
                        key: "emptyTrashAction",
                        namespace: "extension[EmptyTrash]",
                    },
                    handlerId: "EmptyTrash",
                    argument: "empty",
                    fluentIcon: "DeleteDismissRegular" as FluentIcon,
                    hideWindowAfterInvocation: true,
                    requiresConfirmation: true,
                },
            },
        ];
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        if (!searchTerm.toLowerCase().includes("trash")) {
            return [];
        }

        return [
            {
                name: "Empty Trash",
                description: "Empty system trash/recycle bin",
                descriptionTranslation: {
                    key: "emptyTrashDescription",
                    namespace: "extension[EmptyTrash]",
                },
                id: "emptyTrash:action",
                image: this.getImage(),
                defaultAction: {
                    description: "Empty trash",
                    descriptionTranslation: {
                        key: "emptyTrashAction",
                        namespace: "extension[EmptyTrash]",
                    },
                    handlerId: "EmptyTrash",
                    argument: "empty",
                    fluentIcon: "DeleteDismissRegular" as FluentIcon,
                    hideWindowAfterInvocation: true,
                    requiresConfirmation: true,
                },
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(): undefined {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "trash.png")}`,
        };
    }

    public getSettingKeysTriggeringRescan(): string[] {
        return [];
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Empty Trash",
                emptyTrashDescription: "Empty system trash/recycle bin",
                emptyTrashAction: "Empty trash",
                confirmBeforeEmpty: "Confirm before emptying trash",
            },
        };
    }
}
