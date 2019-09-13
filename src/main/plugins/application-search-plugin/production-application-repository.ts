import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { ApplicationSearchOptions } from "../../../common/config/application-search-options";
import { basename, extname } from "path";
import { Icon } from "../../../common/icon/icon";
import { ApplicationIconService } from "./application-icon-service";
import { getApplicationIconFilePath } from "./application-icon-helpers";
import { IconType } from "../../../common/icon/icon-type";

export class ProductionApplicationRepository implements ApplicationRepository {
    private applications: Application[];
    private readonly defaultAppIcon: Icon;
    private readonly appIconService: ApplicationIconService;
    private readonly searchApplications: (options: ApplicationSearchOptions) => Promise<string[]>;
    private config: ApplicationSearchOptions;

    constructor(
        config: ApplicationSearchOptions,
        defaultAppIcon: Icon,
        appIconService: ApplicationIconService,
        searchApplications: (options: ApplicationSearchOptions) => Promise<string[]>,
    ) {
        this.config = config;
        this.defaultAppIcon = defaultAppIcon;
        this.appIconService = appIconService,
        this.searchApplications = searchApplications;
        this.applications = [];
    }

    public getAll(): Promise<Application[]> {
        return Promise.resolve(this.applications);
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.searchApplications(this.config)
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
        return new Promise((resolve, reject) => {
            this.appIconService.clearCache()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedConfig: ApplicationSearchOptions): Promise<void> {
        return new Promise((resolve) => {
            this.config = updatedConfig;
            resolve();
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
