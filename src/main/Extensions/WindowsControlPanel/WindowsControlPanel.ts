import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import { WindowsControlPanelItemsRepository } from "./Contract/WindowsControlPanelItemsRepository";
import { WindowsControlPanelItem } from "./WindowsControlPanelItem";

export class WindowsControlPanel implements Extension {
    public readonly id = "WindowsControlPanel";
    public readonly name = "Windows Control Panel";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[WindowsControlPanel]",
    };

    public readonly author = {
        name: "Torben Kohlmeier",
        githubUserName: "tkohlmeier",
    };

    private knownControlPanelItems: WindowsControlPanelItem[] = [];

    public constructor(
        private readonly currentOperatingSystem: OperatingSystem,
        private readonly translator: Translator,
        private readonly repository: WindowsControlPanelItemsRepository,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const { t } = this.translator.createT(this.getI18nResources());

        this.knownControlPanelItems = await this.repository.retrieveControlPanelItems(this.knownControlPanelItems);
        return this.knownControlPanelItems.map((i) => ({
            id: i.CanonicalName,
            name: i.Name,
            description: i.Description,
            image: { url: `data:image/png;base64,${i.IconBase64}` },
            defaultAction: {
                argument: i.Name,
                description: t("openItem"),
                fluentIcon: "OpenRegular",
                handlerId: this.id,
            },
        }));
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public isSupported(): boolean {
        return this.currentOperatingSystem === "Windows";
    }

    public getSettingKeysTriggeringRescan() {
        return [];
    }

    public getImage(): Image {
        return {
            url: "data:image/png;base64,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",
        };
    }

    public getI18nResources() {
        return {
            en: {
                extensionName: "Windows Control Panel",
                searchResultItemDescription: "Control Panel Item",
                openItem: "Open control panel item",
            },
            de: {
                extensionName: "Windows Systemsteuerung",
                searchResultItemDescription: "Systemsteuerungselement",
                openItem: "Systemsteuerungselement öffnen",
            },
        };
    }
}
