import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileImageGenerator } from "@Core/ImageGenerator";
import type { SettingsManager } from "@Core/SettingsManager";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SearchEngineId } from "@common/Core/Search";
import { searchFilter } from "@common/Core/Search/SearchFilter";
import Database from "better-sqlite3";
import * as Path from "path";
import * as Url from "url";

type VscodeRecent = {
    fileUri?: string;
    folderUri?: string;
    workspace?: {
        id: string;
        configPath: string;
    };
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

    readonly stateDatabasePaths = {
        Windows: process.env.APPDATA + "/Code/User/globalStorage/state.vscdb",
        macOS: process.env.HOME + "/Library/Application Support/Code/User/globalStorage/state.vscdb",
        Linux: process.env.HOME + "/.config/Code/User/globalStorage/state.vscdb",
    };

    recents: SearchResultItem[] = [];

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly fileImageGenerator: FileImageGenerator,
    ) {}

    async getSearchResultItems(): Promise<SearchResultItem[]> {
        const recentPaths = this.getRecents();

        const searchItems = await Promise.all(
            recentPaths.map((recent) => {
                return this.getSearchItem(recent);
            }),
        );

        this.recents = searchItems;
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

    async getSearchItem(recent: VscodeRecent): Promise<SearchResultItem> {
        const uri = recent.fileUri ?? recent.folderUri ?? recent.workspace.configPath;

        let description: string;

        if (recent.fileUri) {
            description = "File";
        } else if (recent.folderUri) {
            description = "Folder";
        } else if (recent.workspace) {
            description = "Workspace";
        }

        let img: Image | undefined;
        if (recent.fileUri) {
            try {
                img = await this.fileImageGenerator.getImage(uri);
            } catch (e) {
                img = this.getDefaultFileImage();
            }
        } else {
            img = this.getImage();
        }

        const url = new URL(decodeURIComponent(uri));
        const path = Url.fileURLToPath(url, { windows: this.operatingSystem === "Windows" });

        const template = this.settingsManager.getValue<string>(
            `extension[${this.id}].command`,
            this.getSettingDefaultValue("command"),
        );

        const command = template.replace("%s", path);

        return {
            id: "vscode-" + path,
            name: Path.basename(path),
            description,
            image: img,
            defaultAction: {
                handlerId: "Commandline",
                description: `Open ${description} in VSCode`,
                argument: command,
            },
        };
    }

    public isSupported(): boolean {
        return ["macOS", "Linux", "Windows"].includes(this.operatingSystem);
    }

    public getSettingDefaultValue<T>(key: string) {
        const defaultSettings = {
            prefix: "vscode",
            command: 'code "%s"',
        };

        return defaultSettings[key] as T;
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
                commandTooltip: "Use %s where the selected file/project should go in the command be sure to quote it",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
        if (this.getPrefix().trim() !== "" && !searchTerm.startsWith(this.getPrefix() + " ")) {
            return [];
        }

        searchTerm = searchTerm.replace(this.getPrefix() + " ", "").trim();

        if (searchTerm && searchTerm === "") {
            return this.recents;
        }

        const fuzziness = this.settingsManager.getValue<number>("searchEngine.fuzziness", 0.5);
        const maxSearchResultItems = this.settingsManager.getValue<number>("searchEngine.maxResultLength", 50);
        const searchEngineId = this.settingsManager.getValue<SearchEngineId>("searchEngine.id", "Fuse.js");

        return searchFilter(
            {
                searchResultItems: this.recents,
                searchTerm,
                fuzziness,
                maxSearchResultItems,
            },
            searchEngineId,
        );
    }

    private getPrefix(): string {
        return this.settingsManager.getValue<string>(
            `extension[${this.id}].prefix`,
            this.getSettingDefaultValue("prefix"),
        );
    }
}
