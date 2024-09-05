import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SearchEngineId } from "@common/Core/Search";
import { searchFilter } from "@common/Core/Search/SearchFilter";
import { readFile } from "node:fs/promises";
import { join } from "path";

interface NativeJetBrainsToolboxRecent {
    name: string;
    path: string;
    lightIcon: boolean;
    newOpenItems: {
        toolId: string;
        displayName: string;
    }[];
}

interface JetBrainsToolboxRecent {
    name: string;
    path: string;
    toolId: string;
    toolName: string;
    hasIcon: boolean;
}

export class JetBrainsToolboxExtension implements Extension {
    public readonly id = "JetBrainsToolbox";
    public readonly name = "JetBrains Toolbox";

    public readonly nameTranslation = {
        key: "extensionName",
        namespace: "extension[JetBrainsToolbox]",
    };

    public readonly author = {
        name: "Sebastian Comans",
        githubUserName: "scomans",
    };

    readonly cachePaths = {
        Windows: process.env.LOCALAPPDATA + "/JetBrains/Toolbox/cache/",
        macOS: process.env.HOME + "/Library/Caches/JetBrains/Toolbox/cache/",
        Linux: process.env.HOME + "/.cache/JetBrains/Toolbox/cache/",
    };

    recents: SearchResultItem[] = [];

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly translator: Translator,
    ) {}

    async getSearchResultItems(): Promise<SearchResultItem[]> {
        const recentPaths = await this.getRecents();

        this.recents = await Promise.all(
            recentPaths.map((recent) => {
                return this.getSearchItem(recent);
            }),
        );
        return [];
    }

    private async getRecents(): Promise<JetBrainsToolboxRecent[]> {
        const cachePath = this.cachePaths[this.operatingSystem];
        const projectsPath = join(cachePath, "intellij_projects.json");

        const exists = await this.fileSystemUtility.pathExists(projectsPath);
        if (!exists) {
            return [];
        }

        const data = await readFile(projectsPath, "utf8");
        return JSON.parse(data)
            .map(
                (recent: NativeJetBrainsToolboxRecent) =>
                    ({
                        name: recent.name,
                        path: recent.path,
                        toolId: recent.newOpenItems[0].toolId,
                        toolName: recent.newOpenItems[0].displayName,
                        hasIcon: !!recent.lightIcon,
                    }) satisfies JetBrainsToolboxRecent,
            )
            .filter((recent: JetBrainsToolboxRecent) => recent.toolId);
    }

    async getSearchItem(recent: JetBrainsToolboxRecent): Promise<SearchResultItem> {
        const { t } = this.translator.createT(this.getI18nResources());
        const img = await this.getProjectImage(recent);
        const path = recent.path;
        const description = `${recent.toolName} ${t("project")}`;

        return {
            id: "jetbrains-toolbox-" + path,
            name: recent.name,
            description,
            image: img,
            defaultAction: {
                handlerId: "Commandline",
                description: t("openWith", { project: recent.name, toolName: recent.toolName }),
                argument: `${recent.toolId.toLowerCase()} ${path}`,
            },
        };
    }

    public isSupported(): boolean {
        return true;
    }

    public getSettingDefaultValue<T>(): T {
        return undefined as T;
    }

    public getImage(): Image {
        return {
            url: `file://${this.assetPathResolver.getExtensionAssetPath("JetBrainsToolbox", "toolbox.png")}`,
        };
    }

    public async getProjectImage(recent: JetBrainsToolboxRecent): Promise<Image> {
        if (recent.hasIcon) {
            const uri = join(recent.path, ".idea/icon.svg");
            const exists = await this.fileSystemUtility.pathExists(uri);
            if (!exists) {
                return {
                    url: `file://${uri}`,
                };
            }
        }
        return this.getImage();
    }

    public getI18nResources() {
        return {
            "en-US": {
                extensionName: "Jetbrains Toolbox",
                project: "Project",
                openWith: "Open {{project}} with {{toolName}}",
            },
            "de-CH": {
                extensionName: "Jetbrains Toolbox",
                project: "Projekt",
                openWith: "{{project}} mit {{toolName}} öffnen",
            },
        };
    }

    public getInstantSearchResultItems(searchTerm: string): SearchResultItem[] {
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
}
