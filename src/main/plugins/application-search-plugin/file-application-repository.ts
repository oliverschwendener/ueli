import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { FileHelpers } from "../../helpers/file-helpers";
import { ApplicationIconService } from "./application-icon-service";

export class FileApplicationRepository implements ApplicationRepository {
    private readonly applicationIconService: ApplicationIconService;
    private config: ApplicationSearchPluginOptions;
    private applications: Application[];

    constructor(applicationIconService: ApplicationIconService, config: ApplicationSearchPluginOptions) {
        this.applicationIconService = applicationIconService;
        this.applications = [];
        this.config = config;
    }

    public getAll(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            resolve(this.applications);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.config.applicationFolders.length === 0) {
                this.applications = [];
                resolve();
            } else {
                FileHelpers.readFilesFromFoldersRecursively(this.config.applicationFolders)
                .then((files) => {
                    const applications = files
                        .filter((file) => this.filterByApplicationFileExtensions(file))
                        .map((applicationFile): Application => this.createApplicationFromFilePath(applicationFile));

                    this.applicationIconService.getIcons(applications)
                        .then((appIcons) => {
                            applications.forEach((application) => {
                                const appIcon = appIcons.find((a) => a.name === application.name);
                                if (appIcon !== undefined) {
                                    application.icon = appIcon.filePathToPng;
                                }
                            });

                            this.applications = applications;
                            resolve();
                        })
                        .catch((err) => {
                            reject(err);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
            }
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.applicationIconService.clearCache()
                .then(() => {
                    resolve();
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public updateConfig(updatedConfig: ApplicationSearchPluginOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this.config = updatedConfig;
            resolve();
        });
    }

    private createApplicationFromFilePath(filePath: string): Application {
        return {
            filePath,
            icon: "",
            name: basename(filePath).replace(extname(filePath), ""),
        };
    }

    private filterByApplicationFileExtensions(file: string): boolean {
        return this.config.applicationFileExtensions.indexOf(extname(file)) > -1;
    }
}
