import { SearchPlugin } from "../../search-plugin";
import { PluginType } from "../../plugin-type";
import { SearchResultItem } from "../../../common/search-result-item";
import { UserConfigOptions } from "../../../common/config/user-config-options";
import { ShortcutsOptions } from "../../../common/config/shortcuts-options";
import { exec } from "child_process";
import { FileHelpers } from "../../helpers/file-helpers";

export class ShortcutsSearchPlugin implements SearchPlugin {
    public readonly pluginType = PluginType.ShortcutsSearchPlugin;
    private config: ShortcutsOptions;

    constructor(config: ShortcutsOptions) {
        this.config = config;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve) => {
            const result = this.config.shortcuts.map((shortcut): SearchResultItem => {
                return {
                    description: shortcut.description,
                    executionArgument: shortcut.executionArgument,
                    icon: shortcut.icon,
                    name: shortcut.name,
                    originPluginType: this.pluginType,
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

    public execute(searchResultItem: SearchResultItem): Promise<void> {
        return new Promise((resolve, reject) => {
            let action: (executionArgument: string) => Promise<void>
                = (): Promise<void> => new Promise((emptyResolve, emptyReject) => {
                    emptyReject(`No execution function found for execution argument: ${searchResultItem.executionArgument}`);
                });

            if (this.isUrl(searchResultItem.executionArgument)) {
                action = this.executeUrl;
            } else if (this.isFilePath(searchResultItem.executionArgument)) {
                action = this.openFile;
            }

            action(searchResultItem.executionArgument)
                .then(() => resolve())
                .catch((err) => reject(err));
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
            this.config = updatedConfig.shortcutsOptions;
            resolve();
        });
    }

    private isUrl(url: string): boolean {
        return url.startsWith("http://")
            || url.startsWith("https://");
    }

    private isFilePath(filePath: string): boolean {
        return filePath.startsWith("/");
    }

    private executeUrl(url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const command = `open "${url}"`;
            exec(command, (err) => {
                if (err) {
                    reject(`Error while executing URL: ${err}`);
                } else {
                    resolve();
                }
            });
        });
    }

    private openFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            FileHelpers.fileExists(filePath)
                .then((exists) => {
                    if (exists) {
                        const command = `open "${filePath}"`;
                        exec(command, (err) => {
                            if (err) {
                                reject(`Error while opening file: ${err}`);
                            } else {
                                resolve();
                            }
                        });
                    } else {
                        reject("Error while opening file: file does not exist.");
                    }
                });
        });
    }
}
