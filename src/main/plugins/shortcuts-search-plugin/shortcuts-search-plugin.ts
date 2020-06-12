import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ShortcutOptions } from "../../../common/config/shortcuts-options";
import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { isValidIcon } from "./../../../common/icon/icon-helpers";
import { OpenLocationPlugin } from "../../open-location-plugin";
import { stringIsWhiteSpace } from "../../../common/helpers/string-helpers";
import { getDefaultShortcutIcon } from "./shortcut-helpers";
import { Logger } from "../../../common/logger/logger";

interface ExecutionArgumentDecodeResult {
    shortcutType: ShortcutType;
    executionArgument: string;
}

export class ShortcutsSearchPlugin implements SearchPlugin, OpenLocationPlugin {
    public readonly pluginType = PluginType.ShortcutsSearchPlugin;
    private config: ShortcutOptions;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;
    private readonly commandlineExecutor: (command: string) => Promise<void>;
    private readonly logger: Logger;


    constructor(
        config: ShortcutOptions,
        urlExecutor: (url: string) => Promise<void>,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        commandlineExecutor: (command: string) => Promise<void>,
        logger: Logger,
    ) {
        this.config = config;
        this.urlExecutor = urlExecutor;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
        this.commandlineExecutor = commandlineExecutor;
        this.logger = logger;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            resolve(this.config.shortcuts.map((shortcut): SearchResultItem => this.createSearchResultItem(shortcut)));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        const decodeResult = this.decodeExecutionArgument(searchResultItem.executionArgument);
        switch (decodeResult.shortcutType) {
            case ShortcutType.Url:
                return this.urlExecutor(decodeResult.executionArgument);
            case ShortcutType.FilePath:
                return this.filePathExecutor(decodeResult.executionArgument, privileged);
            case ShortcutType.CommandlineTool:
                this.commandlineExecutor(decodeResult.executionArgument)
                    .then(() => { /* do nothing */ })
                    .catch(error => this.logger.error(error));

                // We resolve the execution promise here before the actual execution has been resolved.
                // In case that there is an interactive shell which listens to user input the execution promise resolves only after the shell is closed.
                // See here: https://github.com/oliverschwendener/ueli/issues/433
                return Promise.resolve();
            default:
                return this.getUnsupportedShortcutTypePromise(decodeResult.shortcutType);
        }
    }

    public openLocation(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            const decodeResult = this.decodeExecutionArgument(searchResultItem.executionArgument);
            if (decodeResult.shortcutType === ShortcutType.FilePath) {
                this.filePathLocationExecutor(decodeResult.executionArgument)
                    .then(() => resolve())
                    .catch((err) => reject(err));
            } else {
                reject(`Error while trying to open file location. "${decodeResult.executionArgument}" is not a valid file path`);
            }
        });
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve) => {
            resolve();
        });
    }

    public updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig.shortcutOptions;
            resolve();
        });
    }

    private getUnsupportedShortcutTypePromise(shortcutType: ShortcutType): Promise<void> {
        return new Promise((resolve, reject) => {
            reject(`Unsupported shortcut type: ${shortcutType}`);
        });
    }

    private getExecutionArgumentPrefix(shortcutType: string): string {
        return `[[[${shortcutType}]]]`;
    }

    private encodeExecutionArgument(shortcut: Shortcut): string {
        return `${this.getExecutionArgumentPrefix(shortcut.type)}${shortcut.executionArgument}`;
    }

    private decodeExecutionArgument(executionArgument: string): ExecutionArgumentDecodeResult {
        for (const s of Object.values(ShortcutType)) {
            const shortcutType: ShortcutType = s;
            if (executionArgument.startsWith(this.getExecutionArgumentPrefix(shortcutType))) {
                return {
                    executionArgument: executionArgument.replace(this.getExecutionArgumentPrefix(shortcutType), ""),
                    shortcutType,
                };
            }
        }

        throw new Error(`Unknown shortcut type; ${executionArgument}`);
    }

    private createSearchResultItem(shortcut: Shortcut): SearchResultItem {
        return {
            description: stringIsWhiteSpace(shortcut.description)
                ? shortcut.executionArgument
                : shortcut.description,
            executionArgument: this.encodeExecutionArgument(shortcut),
            hideMainWindowAfterExecution: true,
            icon: isValidIcon(shortcut.icon)
                ? shortcut.icon
                : getDefaultShortcutIcon(shortcut),
            name: shortcut.name,
            needsUserConfirmationBeforeExecution: shortcut.needsUserConfirmationBeforeExecution,
            originPluginType: this.pluginType,
            searchable: [shortcut.name, ...shortcut.tags],
            supportsOpenLocation: true,
        };
    }
}
