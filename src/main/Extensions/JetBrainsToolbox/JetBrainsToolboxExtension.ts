import type { AssetPathResolver } from "@Core/AssetPathResolver";
import type { Extension } from "@Core/Extension";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { SettingsManager } from "@Core/SettingsManager";
import type { Translator } from "@Core/Translator";
import type { XmlParser } from "@Core/XmlParser";
import type { OperatingSystem, SearchResultItem } from "@common/Core";
import type { Image } from "@common/Core/Image";
import type { SearchEngineId } from "@common/Core/Search";
import { searchFilter } from "@common/Core/Search/SearchFilter";
import { homedir } from "os";
import { basename, dirname, join, resolve } from "path";

interface JetBrainsToolboxRecent {
    name: string;
    path: string;
    toolName: string;
    toolCommand: string;
    toolIconPath: string;
    projectIconPath?: string;
}

interface JetBrainsRecentProject {
    application: [{ component: [{ option: [{ map: { ":@": { "@_key": string } }[] }] }] }];
}

interface JetBrainsToolboxTool {
    channelId: string;
    displayName: string;
    displayVersion: string;
    installLocation: string;
    launchCommand: string;
}

interface JetBrainsToolboxToolProductInfo {
    dataDirectoryName: string;
    svgIconPath: string;
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

    readonly toolboxPaths = {
        Windows: process.env.LOCALAPPDATA + "/JetBrains/Toolbox/",
        macOS: process.env.HOME + "/Library/Application Support/JetBrains/Toolbox/",
        Linux: process.env.HOME + "/.local/share/JetBrains/Toolbox/",
    };

    readonly configPaths = {
        Windows: process.env.APPDATA + "/JetBrains/",
        macOS: process.env.HOME + "/Library/Application Support/JetBrains/",
        Linux: process.env.HOME + "/.config/JetBrains/",
    };

    recents: SearchResultItem[] = [];

    public constructor(
        private readonly operatingSystem: OperatingSystem,
        private readonly assetPathResolver: AssetPathResolver,
        private readonly settingsManager: SettingsManager,
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly xmlParser: XmlParser,
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

    private replaceJetbrainsVars(path: string): string {
        return path.replace(/\$USER_HOME\$/g, homedir());
    }

    private async getToolRecentProjects(tool: JetBrainsToolboxTool): Promise<JetBrainsToolboxRecent[]> {
        // get info about the tool
        const productInfoPath = join(
            tool.installLocation,
            this.operatingSystem === "macOS" ? "Contents/Resources" : ".",
            "product-info.json",
        );
        if (!(await this.fileSystemUtility.pathExists(productInfoPath))) {
            return [];
        }
        const productInfo = await this.fileSystemUtility.readJsonFile<JetBrainsToolboxToolProductInfo>(productInfoPath);

        // get recent projects
        const recentProjectsPath = join(
            this.configPaths[this.operatingSystem],
            productInfo.dataDirectoryName,
            "options/recentProjects.xml",
        );
        const recentProjectsExists = await this.fileSystemUtility.pathExists(recentProjectsPath);
        if (!recentProjectsExists) {
            return [];
        }
        const recentProjectFileContent = await this.fileSystemUtility.readTextFile(recentProjectsPath);
        const recentProjects = this.xmlParser.parse<[JetBrainsRecentProject]>(recentProjectFileContent, {
            preserveOrder: true,
            ignoreAttributes: false,
        });

        // get project paths
        const projectPaths = recentProjects[0].application[0].component[0].option[0].map.map((entry) =>
            resolve(this.replaceJetbrainsVars(entry[":@"]["@_key"])),
        );

        const projects: JetBrainsToolboxRecent[] = [];
        for (const projectPath of projectPaths) {
            const ideaPath = join(projectPath, ".idea");
            if (!(await this.fileSystemUtility.pathExists(ideaPath))) {
                continue;
            }
            let name: string;
            const nameFileExists = await this.fileSystemUtility.pathExists(join(ideaPath, ".name"));
            if (nameFileExists) {
                name = await this.fileSystemUtility.readTextFile(join(ideaPath, ".name"));
            } else {
                let ideaFiles = await this.fileSystemUtility.readDirectory(ideaPath);
                ideaFiles = ideaFiles.map((f) => basename(f));
                name = ideaFiles.find((f) => f.endsWith(".iml"))?.replace(".iml", "");
            }
            const project = {
                name,
                path: projectPath,
                toolName: tool.displayName,
                toolCommand: join(tool.installLocation, tool.launchCommand),
                toolIconPath: join(dirname(productInfoPath), productInfo.svgIconPath),
                projectIconPath: join(ideaPath, "icon.svg"),
            };
            if (project.name) {
                projects.push(project);
            }
        }
        return projects;
    }

    private async getRecents(): Promise<JetBrainsToolboxRecent[]> {
        const toolboxPaths = this.toolboxPaths[this.operatingSystem];
        const state = await this.fileSystemUtility.readJsonFile<{
            tools: JetBrainsToolboxTool[];
        }>(join(toolboxPaths, "state.json"));

        const recents: JetBrainsToolboxRecent[] = [];
        for (const tool of state.tools) {
            const recentProjects = await this.getToolRecentProjects(tool);
            recents.push(...recentProjects);
        }
        return recents;
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
                argument: `${recent.toolCommand} "${path}"`,
                hideWindowAfterInvocation: true,
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
        if (recent.projectIconPath) {
            const exists = await this.fileSystemUtility.pathExists(recent.projectIconPath);
            if (exists) {
                return {
                    url: `file://${recent.projectIconPath}`,
                };
            }
        }
        if (recent.toolIconPath) {
            const exists = await this.fileSystemUtility.pathExists(recent.toolIconPath);
            if (exists) {
                return {
                    url: `file://${recent.toolIconPath}`,
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
