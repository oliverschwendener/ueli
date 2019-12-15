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
    private controlPanelItems: ControlPanelItem[] = [];

    constructor(private config: ControlPanelOptions, private logger: Logger) {}

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public async execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        const shell = new Powershell({});
        shell.addCommand(`powershell -Command "Show-ControlPanelItem -Name '${searchResultItem.executionArgument}'"`);
        shell.invoke().catch(reason => this.logger.error('Opening control panel item failed: ' + reason));
    }

    public async updateConfig(updatedConfig: UserConfigOptions, translationSet: TranslationSet): Promise<void> {
        this.config = updatedConfig.controlPanelOptions;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        return this.controlPanelItems.map((item) => ({
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
    }

    public async refreshIndex(): Promise<void> {
        this.controlPanelItems = await ControlPanelItemsRetriever.RetrieveControlPanelItems(this.controlPanelItems);
    }

    public async clearCache(): Promise<void> {
        // not necessary
    }
}
