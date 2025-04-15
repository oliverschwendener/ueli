import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
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

type VSCodeRecentRaw = {
    fileUri?: string;
    folderUri?: string;
    workspace?: {
        id: string;
        configPath: string;
    };
    label?: string;
};

type VSCodeRecent = {
    label?: string;
    path: string;
    uri: string;
    fileType: string;
    commandArg: string;
    img: Image;
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

    private recents: VSCodeRecent[] = [];

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly logger: Logger,
        private readonly settingsManager: SettingsManager,
        private readonly fileImageGenerator: FileImageGenerator,
        private readonly fileSystemUtility: FileSystemUtility,
    ) {}

    public async getSearchResultItems(): Promise<SearchResultItem[]> {
        const recents: VSCodeRecent[] = [];

        for (const recent of this.getRecentsRaw()) {
            try {
                recents.push(await this.getRecent(recent));
            } catch (error) {
                const uri = this.getUri(recent);
                this.logger.error(this.id + ": " + uri + " " + error);
            }
        }

        this.recents = recents;

        return [];
    }

    private getRecentsRaw(): VSCodeRecentRaw[] {
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

    private async getRecent(recentRaw: VSCodeRecentRaw): Promise<VSCodeRecent> {
        const uri = this.getUri(recentRaw);
        return {
            label: recentRaw.label,
            uri: uri,
            fileType: this.getFileType(recentRaw, uri),
            path: this.getPath(uri),
            commandArg: this.getCommandArg(recentRaw),
            img: await this.getImg(recentRaw, uri),
        };
    }

    private getUri = (recentRaw: VSCodeRecentRaw) => {
        if (recentRaw.fileUri) {
            return recentRaw.fileUri;
        }

        if (recentRaw.folderUri) {
            return recentRaw.folderUri;
        }

        if (recentRaw.workspace) {
            return recentRaw.workspace.configPath;
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

    private getFileType(recentRaw: VSCodeRecentRaw, uri: string): string {
        let result;

        if (recentRaw.fileUri) {
            result = "File";
        } else if (recentRaw.folderUri) {
            result = "Folder";
        } else if (recentRaw.workspace) {
            result = "Workspace";
        } else {
            throw new Error("Unknown file type");
        }

        return uri.startsWith("file://") ? result : `Remote ${result}`;
    }

    private getCommandArg(recentRaw: VSCodeRecentRaw): string {
        if (recentRaw.fileUri || recentRaw.workspace) {
            return "--file-uri";
        } else if (recentRaw.folderUri) {
            return "--folder-uri";
        }

        throw new Error("Unknown file type");
    }

    private async getImg(recentRaw: VSCodeRecentRaw, uri: string): Promise<Image> {
        if (recentRaw.fileUri) {
            try {
                return await this.fileImageGenerator.getImage(uri);
            } catch (e) {
                return this.getDefaultFileImage();
            }
        }

        return this.getImage();
    }

    public isSupported(): boolean {
        return ["macOS", "Linux", "Windows"].includes(this.operatingSystem);
    }

    public getSettingDefaultValue<T extends keyof Settings>(key: T): Settings[T] {
        const defaultSettings: Settings = {
            prefix: "vscode",
            command: "code %s",
            showPath: false,
        };

        if (this.operatingSystem === "macOS") {
            defaultSettings.command = "/usr/local/bin/code %s";
        }

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
                    "The prefix to trigger Visual Studio Code. Open recently opened files and projects: <prefix> <command>",
                command: "Command",
                commandTooltip:
                    "Use %s where the selected file/project should be inserted. It uses the --file-uri or --folder-uri switch",
                showPath: "Show file/folder path",
            },
            "ja-JP": {
                extensionName: "Visual Studio Code",
                prefix: "接頭辞",
                prefixDescription:
                    "Visual Studio Code起動のトリガとなる接頭辞です。次のパターンで使用します： <prefix> <command>",
                command: "コマンド",
                commandTooltip:
                    "%s が開きたいファイル/プロジェクトに置換されます。これは起動スイッチの --file-uri もしくは --folder-uri で使用されます",
                showPath: "Show file/folder path",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): InstantSearchResultItems {
        if (this.getPrefix().trim() !== "" && !searchTerm.startsWith(this.getPrefix() + " ")) {
            return createEmptyInstantSearchResult();
        }

        const template = this.settingsManager.getValue<string>(
            `extension[${this.id}].command`,
            this.getSettingDefaultValue("command"),
        );

        const showPath = this.settingsManager.getValue<boolean>(
            `extension[${this.id}].showPath`,
            this.getSettingDefaultValue("showPath"),
        );

        searchTerm = searchTerm.replace(this.getPrefix() + " ", "").trim();

        if (!isPath(searchTerm)) {
            return this.getRecentSearchResults(searchTerm, template, showPath);
        } else {
            return this.getFilesystemSearchResults(searchTerm, template);
        }
    }

    private getRecentSearchResults(searchTerm: string, template: string, showPath: boolean): InstantSearchResultItems {
        const searchResultItems = this.recents.map((recent) => this.getSearchResultItem(recent, template, showPath));

        if (searchTerm === "") {
            return {
                after: searchResultItems,
                before: [],
            };
        }

        const fuzziness = this.settingsManager.getValue<number>("searchEngine.fuzziness", 0.5);
        const maxSearchResultItems = this.settingsManager.getValue<number>("searchEngine.maxResultLength", 50);
        const searchEngineId = this.settingsManager.getValue<SearchEngineId>("searchEngine.id", "fuzzysort");

        return {
            after: searchFilter(
                {
                    searchResultItems,
                    searchTerm,
                    fuzziness,
                    maxSearchResultItems,
                },
                searchEngineId,
            ),
            before: [],
        };
    }

    private getSearchResultItem(recent: VSCodeRecent, template: string, showPath: boolean): SearchResultItem {
        return {
            id: `vscode-${recent.fileType}-${recent.uri}`,
            name: (recent.label ?? Path.basename(recent.path)) + (showPath ? ` (${recent.path})` : ""),
            description: recent.fileType,
            details: recent.path,
            image: recent.img,
            defaultAction: {
                handlerId: "Commandline",
                description: `Open ${recent.fileType} in VSCode`,
                argument: template.replace("%s", `${recent.commandArg} ${recent.uri}`),
                hideWindowAfterInvocation: true,
            },
        };
    }

    private instant: SearchResultItem[] = [];

    private getFilesystemSearchResults(searchTerm: string, template: string): InstantSearchResultItems {
        searchTerm = searchTerm.replace("~", (process.env as Record<string, string>).HOME);

        if (this.fileSystemUtility.isDirectory(searchTerm)) {
            const entries = this.fileSystemUtility.readDirectorySync(searchTerm, false);

            this.instant = entries.map((e) => this.getFilePathItem(e, template, this.fileSystemUtility.isDirectory(e)));
        }

        return {
            after: this.instant,
            before: [],
        };
    }

    private getFilePathItem(path: string, template: string, isDir: boolean): SearchResultItem {
        return {
            id: `vscode-filepath-${path}`,
            name: Path.basename(path),
            details: path,
            description: isDir ? "Folder" : "File",
            image: isDir ? this.getImage() : this.getDefaultFileImage(),
            defaultAction: {
                handlerId: "Commandline",
                description: `Open ${path} in VSCode`,
                argument: template.replace("%s", path),
                hideWindowAfterInvocation: true,
            },
        };
    }

    private getPrefix(): string {
        return this.settingsManager.getValue<string>(
            `extension[${this.id}].prefix`,
            this.getSettingDefaultValue("prefix"),
        );
    }
}

export const isPath = (searchTerm: string | null | undefined) => {
    if (!searchTerm) {
        return false;
    }

    const windowMatch = searchTerm.match(/[A-Z]:.*/) !== null;
    return searchTerm.startsWith("/") || searchTerm.startsWith("~") || windowMatch;
};
