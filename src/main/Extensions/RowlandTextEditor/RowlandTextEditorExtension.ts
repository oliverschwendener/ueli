import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import { createInvokeExtensionAction, type SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { InvocationArgument, RowlandTextEditorSettings as Settings } from "@common/Extensions/RowlandTextEditor";
import type { TextProcessor } from "./TextProcessor";

export class RowlandTextEditorExtension implements Extension {
    public readonly id = "RowlandTextEditor";
    public readonly name = "Rowland Text Editor";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[RowlandTextEditor]",
    };

    public readonly defaultSettings: Settings = {
        columnSeparator: "\\t",
        rowSeparator: "\\n",
    };

    public readonly author = {
        name: "Christopher Steiner",
        githubUserName: "ChristopherSteiner",
    };

    public constructor(
        private readonly assetPathResolver: AssetPathResolver,
        private readonly translator: Translator,
        private readonly textProcessor: TextProcessor,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());
        return [
            {
                id: "RowlandTextEditor:invoke",
                description: t("searchResultItemDescription"),
                name: t("searchResultItemName"),
                image: this.getImage(),
                defaultAction: createInvokeExtensionAction({
                    extensionId: this.id,
                    description: t("searchResultItemActionDescription"),
                    fluentIcon: "OpenRegular",
                }),
            },
        ];
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
        return this.defaultSettings[key];
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath(this.id, "rowland-texteditor.png")}`,
        };
    }

    public async invoke({ inputText, pattern, settings }: InvocationArgument): Promise<string> {
        return this.textProcessor.process(inputText, pattern, settings.rowSeparator, settings.columnSeparator);
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Rowland Text Editor",
                searchResultItemName: "Rowland Text Editor",
                searchResultItemDescription: "Format rows of text",
                searchResultItemActionDescription: "Open Rowland Text Editor",
                copyToClipboard: "Copy result to clipboard",
                inputPlaceholder: "Input",
                outputPlaceholder: "Output",
                patternLabel: "Pattern",
                patternPlaceholder: "Pattern",
                rowSeparatorLabel: "Row separator",
                rowSeparatorPlaceholder: "Row separator",
                columnSeparatorLabel: "Column separator",
                columnSeparatorPlaceholder: "Column separator",
            },
            "de-CH": {
                extensionName: "Rowland Text Editor",
                searchResultItemName: "Rowland Text Editor",
                searchResultItemDescription: "Reihen von Text formatieren",
                searchResultItemActionDescription: "Rowland Text Editor öffnen",
                copyToClipboard: "Resultat in Zwischenablage kopieren",
                inputPlaceholder: "Eingabe",
                outputPlaceholder: "Resultat",
                patternLabel: "Pattern",
                patternPlaceholder: "Pattern",
                rowSeparatorLabel: "Zeilentrennzeichen",
                rowSeparatorPlaceholder: "Zeilentrennzeichen",
                columnSeparatorLabel: "Spaltentrennzeichen",
                columnSeparatorPlaceholder: "Spaltentrennzeichen",
            },
        };
    }
}
