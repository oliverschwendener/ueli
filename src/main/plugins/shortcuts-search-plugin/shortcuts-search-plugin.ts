import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ShortcutOptions } from "../../../common/config/shortcuts-options";
import { Shortcut } from "./shortcut";
import { ShortcutType } from "./shortcut-type";
import { AutoCompletionResult } from "../../../common/auto-completion-result";
import { isValidIcon } from "./../../../common/icon/icon-helpers";
import { defaultShortcutIcon } from "../../../common/icon/default-icons";

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
    private readonly commandlineExtecutor: (command: string) => Promise<void>;

    constructor(
        config: ShortcutOptions,
        urlExecutor: (url: string) => Promise<void>,
        filePathExecutor: (filePath: string, privileged: boolean) => Promise<void>,
        filePathLocationExecutor: (filePath: string) => Promise<void>,
        commandlineExecutor: (command: string) => Promise<void>,
        ) {
        this.config = config;
        this.urlExecutor = urlExecutor;
        this.filePathExecutor = filePathExecutor;
        this.filePathLocationExecutor = filePathLocationExecutor;
        this.commandlineExtecutor = commandlineExecutor;
    }

    public async getAll(): Promise<SearchResultItem[]> {
        try {
            const result = this.config.shortcuts.map((shortcut): SearchResultItem => {
                return {
                    description: shortcut.description,
                    executionArgument: this.encodeExecutionArgument(shortcut),
                    hideMainWindowAfterExecution: true,
                    icon: isValidIcon(shortcut.icon)
                        ? shortcut.icon
                        : defaultShortcutIcon,
                    name: shortcut.name,
                    originPluginType: this.pluginType,
                    searchable: [shortcut.name].concat(shortcut.tags),
                };
            });
            return result;

        } catch (error) {
            return error;
        }
    }

    public async clearCache(): Promise<void> {} // tslint:disable-line

    public execute(searchResultItem: SearchResultItem, privileged: boolean): Promise<void> {
        const decodeResult = this.decodeExecutionArgument(searchResultItem.executionArgument);
        switch (decodeResult.shortcutType) {
            case ShortcutType.Url:
                return this.urlExecutor(decodeResult.executionArgument);
            case ShortcutType.FilePath:
                return this.filePathExecutor(decodeResult.executionArgument, privileged);
            case ShortcutType.CommandlineTool:
                return this.commandlineExtecutor(decodeResult.executionArgument);
            default:
                return this.getUnsupportedShortcutTypePromise(decodeResult.shortcutType);
        }
    }

    public async openLocation(searchResultItem: SearchResultItem): Promise<void> {
        try {
            const decodeResult = this.decodeExecutionArgument(searchResultItem.executionArgument);
            if (decodeResult.shortcutType === ShortcutType.FilePath) {
                await this.filePathLocationExecutor(decodeResult.executionArgument);
            }
        } catch (error) {
            return error;
        }
    }

    public autoComplete(searchResultItem: SearchResultItem): Promise<AutoCompletionResult> {
        throw Error("Autocompletion not supported");
    }

    public isEnabled(): boolean {
        return this.config.isEnabled;
    }

    public async refreshIndex(): Promise<void> {} // tslint:disable-line

    public async updateConfig(updatedConfig: UserConfigOptions): Promise<void> {
        this.config = updatedConfig.shortcutOptions;
    }

    private async getUnsupportedShortcutTypePromise(shortcutType: ShortcutType): Promise<void> {
        throw Error(`Unsupported shortcut type: ${shortcutType}`);
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
