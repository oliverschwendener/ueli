import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { ApplicationSearchOptions } from "../../../common/config/application-search-options";
import * as Powershell from "node-powershell";
import { normalize, basename, extname } from "path";
import { Icon } from "../../../common/icon/icon";
import { ApplicationIconService } from "./application-icon-service";
import { getApplicationIconFilePath } from "./application-icon-helpers";
import { IconType } from "../../../common/icon/icon-type";
import { executeCommandWithOutput } from "../../executors/command-executor";

export class WindowsApplicationRepository implements ApplicationRepository {
    private applications: Application[];
    private readonly defaultAppIcon: Icon;
    private readonly appIconService: ApplicationIconService;
    private config: ApplicationSearchOptions;

    constructor(config: ApplicationSearchOptions, defaultAppIcon: Icon, appIconService: ApplicationIconService) {
        this.config = config;
        this.defaultAppIcon = defaultAppIcon;
        this.appIconService = appIconService,
        this.applications = [];
    }

    public getAll(): Promise<Application[]> {
        return Promise.resolve(this.applications);
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getAllFilePaths()
                .then((filePaths) => {
                    this.applications = filePaths.map((filePath) => this.createApplicationFromFilePath(filePath));

                    if (this.config.useNativeIcons) {
                        this.appIconService.generateAppIcons(this.applications)
                            .then(() => {
                                this.onSuccessfullyGeneratedAppIcons();
                                resolve();
                            })
                            .catch((err) => reject(err));
                    } else {
                        resolve();
                    }
                })
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return Promise.reject("not implemented");
    }

    public updateConfig(updatedConfig: ApplicationSearchOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig;
            resolve();
        });
    }

    private getAllFilePaths(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            if (this.config.applicationFolders.length === 0 || this.config.applicationFileExtensions.length === 0) {
                resolve([]);
            }

            const ps = new Powershell({
                executionPolicy: "Bypass",
                noProfile: true,
            });

            const extensionFilter = this.config.applicationFileExtensions.map((e) => `*${e}`).join(", ");
            const getChildItem = `Get-ChildItem -Path $_ -include ${extensionFilter} -Recurse -File | % { $_.FullName }`;
            const folders = this.config.applicationFolders.map((applicationFolder) => `'${applicationFolder}'`).join(",");
            const powershellScript = `${folders} | %{ ${getChildItem} }`;

            executeCommandWithOutput(`powershell -Command "& { ${powershellScript} }"`)
                .then((data) => {
                    const filePaths = data
                        .split("\n")
                        .map((f) => normalize(f).trim())
                        .filter((f) => f.length > 1);

                    resolve(filePaths);
                })
                .catch((err) => reject(err));

            ps.addCommand(powershellScript);
            ps.invoke()

                .finally(ps.dispose);
        });
    }

    private createApplicationFromFilePath(filePath: string): Application {
        return {
            filePath,
            icon: this.defaultAppIcon,
            name: basename(filePath).replace(extname(filePath), ""),
        };
    }

    private onSuccessfullyGeneratedAppIcons() {
        this.applications.forEach((application) => application.icon = {
            parameter: getApplicationIconFilePath(application.filePath),
            type: IconType.URL,
        });
    }
}
