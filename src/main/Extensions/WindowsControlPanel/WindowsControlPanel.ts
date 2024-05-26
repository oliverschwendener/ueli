import type { AssetPathResolver } from "@Core/AssetPathResolver/Contract";
import type { Extension } from "@Core/Extension";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { WindowsControlPanelItem } from "./WindowsControlPanelItem";
import type { WindowsControlPanelItemsRepository } from "./WindowsControlPanelItemsRepositoryInterface";

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
        private readonly assetPathResolver: AssetPathResolver,
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
            url: this.assetPathResolver.getExtensionAssetPath(this.id, "control-panel-icon.png"),
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
