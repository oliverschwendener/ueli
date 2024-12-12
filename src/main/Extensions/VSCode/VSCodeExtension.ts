import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { Logger } from "@Core/Logger";
import type { SettingsManager } from "@Core/SettingsManager";
import {
    createEmptyInstantSearchResult,
    type InstantSearchResultItems,
    type OperatingSystem,
    type SearchResultItem,
} from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SearchEngineId } from "@common/Core/Search";
import { searchFilter } from "@common/Core/Search/SearchFilter";
import Database from "better-sqlite3";
import * as Path from "path";
import * as Url from "url";
import type { Settings } from "./Settings";

type VscodeRecent = {
    fileUri?: string;
    folderUri?: string;
    workspace?: {
        id: string;
        configPath: string;
    };
    label?: string;
};

export class VSCodeExtension implements Extension {
    public readonly id = "VSCode";
    public readonly name = "Visual Studio Code";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[VSCode]",
    };

    public readonly author = {
        name: "Ethan Conneely",
        githubUserName: "IrishBruse",
    };

    private readonly stateDatabasePaths = {
        Windows: process.env.APPDATA + "/Code/User/globalStorage/state.vscdb",
        macOS: process.env.HOME + "/Library/Application Support/Code/User/globalStorage/state.vscdb",
        Linux: process.env.HOME + "/.config/Code/User/globalStorage/state.vscdb",
    };

    private recents: SearchResultItem[] = [];

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly logger: Logger,
        private readonly settingsManager: SettingsManager,
        private readonly fileImageGenerator: FileImageGenerator,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const searchResults: SearchResultItem[] = [];

        for (const recent of this.getRecents()) {
            try {
                searchResults.push(await this.getSearchItem(recent));
            } catch (error) {
                const uri = this.getUri(recent);
                this.logger.error(this.id + ": " + uri + " " + error);
            }
        }

        this.recents = searchResults;

        return [];
    }

    private getRecents(): VscodeRecent[] {
        const databasePath = this.stateDatabasePaths[this.operatingSystem];

        return JSON.parse(
            new Database(databasePath, {})
                .prepare(
                    "SELECT json_extract(value, '$.entries') as entries FROM ItemTable WHERE key = 'history.recentlyOpenedPathsList'",
                )
                .pluck()
                .get() as string,
        );
    }

    private getUri = (recent: VscodeRecent) => {
        if (recent.fileUri) {
            return recent.fileUri;
        }

        if (recent.folderUri) {
            return recent.folderUri;
        }

        if (recent.workspace) {
            return recent.workspace.configPath;
        }

        throw new Error("Unknown file type");
    };

    private getPath = (uri: string) => {
        const decodedUri = decodeURIComponent(uri);
        if (uri.startsWith("file://")) {
            const url = new URL(decodedUri);
            return Url.fileURLToPath(url, { windows: this.operatingSystem === "Windows" });
        }
        return decodedUri;
    };

    private getFileType(recent: VscodeRecent, uri: string): string {
        let result;

        if (recent.fileUri) {
            result = "File";
        } else if (recent.folderUri) {
            result = "Folder";
        } else if (recent.workspace) {
            result = "Workspace";
        } else {
            throw new Error("Unknown file type");
        }

        return uri.startsWith("file://") ? result : `Remote ${result}`;
    }

    private getCommandArg(recent: VscodeRecent): string {
        if (recent.fileUri) {
            return "--file-uri";
        } else if (recent.folderUri) {
            return "--folder-uri";
        } else if (recent.workspace) {
            return "--file-uri";
        }

        throw new Error("Unknown file type");
    }

    private async getImg(recent: VscodeRecent, uri: string): Promise<Image> {
        if (recent.fileUri) {
            try {
                return await this.fileImageGenerator.getImage(uri);
            } catch (e) {
                return this.getDefaultFileImage();
            }
        }

        return this.getImage();
    }

    private async getSearchItem(recent: VscodeRecent): Promise<SearchResultItem> {
        const uri = this.getUri(recent);
        const fileType = this.getFileType(recent, uri);
        const commandArg = this.getCommandArg(recent);
        const img = await this.getImg(recent, uri);
        const path = this.getPath(uri);

        const template = this.settingsManager.getValue<string>(
            `extension[${this.id}].command`,
            this.getSettingDefaultValue("command"),
        );

        return {
            id: `vscode-${fileType}-${uri}`,
            name: recent.label ?? Path.basename(path),
            description: fileType,
            image: img,
            defaultAction: {
                handlerId: "Commandline",
                description: `Open ${fileType} in VSCode`,
                argument: template.replace("%s", `${commandArg} ${uri}`),
            },
        };
    }

    public isSupported(): boolean {
        return ["macOS", "Linux", "Windows"].includes(this.operatingSystem);
    }

    public getSettingDefaultValue(key: keyof Settings) {
        const defaultSettings: Settings = {
            prefix: "vscode",
            command: 'code "%s"',
        };

        return defaultSettings[key];
    }

    public getImage(): Image {
        const path = this.assetPathResolver.getExtensionAssetPath("VSCode", "vscode.png");

        return {
            url: `file://${path}`,
        };
    }

    public getDefaultFileImage(): Image {
        const path = this.assetPathResolver.getExtensionAssetPath("VSCode", "default-file-icon.png");

        return {
            url: `file://${path}`,
        };
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Visual Studio Code",
                prefix: "Prefix",
                prefixDescription:
                    "The prefix to trigger visual studio code. Open recently opened files and projects: <prefix> <command>",
                command: "Command",
                commandTooltip: "Use %s where the selected file/project should go it uses the --file/folder-uri switch",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        if (this.getPrefix().trim() !== "" && !searchTerm.startsWith(this.getPrefix() + " ")) {
            return createEmptyInstantSearchResult();
        }

        searchTerm = searchTerm.replace(this.getPrefix() + " ", "").trim();

        if (searchTerm && searchTerm === "") {
            return {
                after: this.recents,
                before: [],
            };
        }

        const fuzziness = this.settingsManager.getValue<number>("searchEngine.fuzziness", 0.5);
        const maxSearchResultItems = this.settingsManager.getValue<number>("searchEngine.maxResultLength", 50);
        const searchEngineId = this.settingsManager.getValue<SearchEngineId>("searchEngine.id", "fuzzysort");

        return {
            after: searchFilter(
                {
                    searchResultItems: this.recents,
                    searchTerm,
                    fuzziness,
                    maxSearchResultItems,
                },
                searchEngineId,
            ),
            before: [],
        };
    }

    private getPrefix(): string {
        return this.settingsManager.getValue<string>(
            `extension[${this.id}].prefix`,
            this.getSettingDefaultValue("prefix"),
        );
    }
}
