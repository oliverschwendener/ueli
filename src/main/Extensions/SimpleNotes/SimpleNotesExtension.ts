import { createInvokeExtensionAction, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";

export class SimpleNotesExtension implements Extension {
    public readonly id = "SimpleNotes";

    public readonly name = "Simple Notes";

    public readonly nameTranslation = {
        namespace: "extension[SimpleNotes]",
        key: "extensionName",
    };

    public readonly author = {
        name: "Oliver Schwendener",
        githubUserName: "oliverschwendener",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        return [
            {
                id: "extension[SimpleNotes].createNewNote",
                name: t("searchResultItemName"),
                description: "Simple Notes",
                defaultAction: createInvokeExtensionAction({
                    extensionId: this.id,
                    description: "Create new note",
                }),
                image: this.getImage(),
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue(): unknown {
        return undefined;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "simple-notes.png")}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Simple Notes",
                searchResultItemName: "Create new note",
            },
            "de-CH": {
                extensionName: "Einfache Notizen",
                searchResultItemName: "Create new note",
            },
        };
    }

    public async invoke(argument: unknown): Promise<void> {
        console.log("invoked", argument);
    }
}
