import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ShortcutOptions } from "../../../common/config/shortcuts-options";
import { IconHelpers } from "../../../common/icon/icon-helpers";
import { defaultShortcutIcon } from "../../../common/config/default-shortcuts-options";
import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { AutoCompletionResult } from "../../../common/auto-completion-result";

interface ExecutionArgumentDecodeResult {
    shortcutType: ShortcutType;
    executionArgument: string;
}

export class ShortcutsSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.ShortcutsSearchPlugin;
    public readonly openLocationSupported = true;
    public readonly autoCompletionSupported = false;
    private config: ShortcutOptions;
    private readonly urlExecutor: (url: string) => Promise<void>;
    private readonly filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>;
    private readonly filePathLocationExecutor: (filePath: string) => Promise<void>;

    constructor(
        config: ShortcutOptions,
        urlExecutor: (url: string) => Promise<void>,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        ) {
        this.config = config;
        this.urlExecutor = urlExecutor;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.config.shortcuts.map((shortcut): SearchResultItem => {
                return {
                    description: shortcut.description,
                    executionArgument: this.encodeExecutionArgument(shortcut),
                    hideMainWindowAfterExecution: true,
                    icon: IconHelpers.isValidIcon(shortcut.icon)
                        ? shortcut.icon
                        : defaultShortcutIcon,
                    name: shortcut.name,
                    originPluginType: this.pluginType,
                    searchable: [shortcut.name].concat(shortcut.tags),
                };
            });

            resolve(result);
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
                return this.executeUrl(decodeResult.executionArgument);
            case ShortcutType.FilePath:
                return this.executeFilePath(decodeResult.executionArgument, privileged);
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

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        return new Promise((resolve, reject) => {
            reject("Autocompletion not supported");
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

    private executeUrl(url: string): Promise<void> {
        return this.urlExecutor(url);
    }

    private executeFilePath(filePath: string, privileged: boolean): Promise<void> {
        return this.filePathExecutor(filePath, privileged);
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
}
