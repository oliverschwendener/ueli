import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { ApplicationSearchOptions } from "../../../common/config/application-search-options";
import { basename, extname } from "path";
import { Icon } from "../../../common/icon/icon";
import { ApplicationIconService } from "./application-icon-service";
import { getApplicationIconFilePath } from "./application-icon-helpers";
import { IconType } from "../../../common/icon/icon-type";
import { Logger } from "../../../common/logger/logger";
import { OperatingSystemVersion } from "../../../common/operating-system";
import { ApplicationNativeNameService } from "./application-native-name-service";

export class ProductionApplicationRepository implements ApplicationRepository {
    private applications: Application[];
    private readonly defaultAppIcon: Icon;
    private readonly appIconService: ApplicationIconService;
    private readonly appNativeNameService: ApplicationNativeNameService;
    private readonly searchApplications: (
        options: ApplicationSearchOptions,
        logger: Logger,
        operatingSystemVersion: OperatingSystemVersion,
    ) => Promise<string[]>;
    private config: ApplicationSearchOptions;
    private readonly logger: Logger;
    private readonly operatingSystemVersion: OperatingSystemVersion;

    constructor(
        config: ApplicationSearchOptions,
        defaultAppIcon: Icon,
        appIconService: ApplicationIconService,
        appNativeNameService: ApplicationNativeNameService,
        searchApplications: (
            options: ApplicationSearchOptions,
            logger: Logger,
            operatingSystemVersion: OperatingSystemVersion,
        ) => Promise<string[]>,
        logger: Logger,
        operatingSystemVersion: OperatingSystemVersion,
    ) {
        this.config = config;
        this.defaultAppIcon = defaultAppIcon;
        this.appNativeNameService = appNativeNameService;
        this.appIconService = appIconService;
        this.searchApplications = searchApplications;
        this.logger = logger;
        this.operatingSystemVersion = operatingSystemVersion;
        this.applications = [];
    }

    public getAll(): Promise<Application[]> {
        return Promise.resolve(this.applications);
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.searchApplications(this.config, this.logger, this.operatingSystemVersion)
                .then((filePaths) => {
                    const applications = filePaths.map((filePath) => this.createApplicationFromFilePath(filePath));
                    const task = [];
                    if (this.config.useNativeName)
                        task.push(
                            this.appNativeNameService.generateAppNativeName(applications).then(() => {
                                this.applications = applications;
                            }),
                        );
                    if (this.config.useNativeIcons) {
                        task.push(
                            this.appIconService.generateAppIcons(applications).then(() => {
                                this.onSuccessfullyGeneratedAppIcons(applications);
                                this.applications = applications;
                            }),
                        );
                    }
                    if (task.length === 0) {
                        this.applications = applications;
                        resolve();
                    } else {
                        Promise.all(task)
                            .then(() => resolve())
                            .catch((err) => reject(err));
                    }
                })
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            Promise.all([this.appIconService.clearCache(), this.appNativeNameService.clearCache()])
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

    private onSuccessfullyGeneratedAppIcons(applications: Application[]) {
        applications.forEach(
            (application) =>
                (application.icon = {
                    parameter: getApplicationIconFilePath(application.filePath),
                    type: IconType.URL,
                }),
        );
    }
}
