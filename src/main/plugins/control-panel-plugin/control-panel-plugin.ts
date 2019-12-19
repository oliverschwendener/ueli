import { SearchResultItem } from "../../../common/search-result-item";
import { PluginType } from "../../plugin-type";
import { IconType } from "../../../common/icon/icon-type";
import { TranslationSet } from "../../../common/translation/translation-set";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { SearchPlugin } from "../../search-plugin";
import { ControlPanelOptions } from "../../../common/config/control-panel-options";
import { ControlPanelItem } from "./control-panel-item";
import { defaultControlPanelIcon } from "../../../common/icon/default-icons";
import { ControlPanelItemsRetriever } from "./control-panel-items-retriever";
import { Logger } from "../../../common/logger/logger";
import * as Powershell from "node-powershell";

export class ControlPanelPlugin implements SearchPlugin {
    public pluginType = PluginType.ControlPanel;
    private controlPanelItems: ControlPanelItem[];
    private config: ControlPanelOptions;
    private readonly logger: Logger;

    constructor(config: ControlPanelOptions, logger: Logger) {
        this.config = config;
        this.logger = logger;
        this.controlPanelItems = [];
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        return new Promise((resolve) => {
            const shell = new Powershell({});
            shell.addCommand(`powershell -Command "Show-ControlPanelItem -Name '${searchResultItem.executionArgument}'"`)
                .then(() => shell.invoke())
                .catch((reason) => this.logger.error("Opening control panel item failed: " + reason))
                .finally(() => shell.dispose());
            resolve();
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.controlPanelOptions;
            resolve();
        });
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const searchResultItems = this.controlPanelItems.map((item) => ({
                description: item.Description,
                executionArgument: item.Name,
                hideMainWindowAfterExecution: true,
                icon: {
                    parameter: item.IconBase64
                        ? `data:image/png;base64,${item.IconBase64}`
                        : defaultControlPanelIcon,
                    type: IconType.URL,
                },
                name: item.Name,
                needsUserConfirmationBeforeExecution: false,
                originPluginType: PluginType.ControlPanel,
                searchable: [item.Name, item.Description],
                supportsAutocompletion: true,
                supportsOpenLocation: false,
            }));
            resolve(searchResultItems);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.config.isEnabled) {
                ControlPanelItemsRetriever.RetrieveControlPanelItems(this.controlPanelItems)
                .then((controlPanelItems) => {
                    this.controlPanelItems = controlPanelItems;
                    resolve();
                })
                .catch((resaon) => reject(resaon));
            } else {
                resolve();
            }
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }
}
