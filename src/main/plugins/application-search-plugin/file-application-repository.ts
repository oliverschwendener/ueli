import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchOptions } from "./application-search-options";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { ApplicationIconService } from "./application-icon-service";
import { getApplicationIconFilePath } from "./application-icon-helpers";
import { uniq } from "lodash";
import { Logger } from "../../../common/logger/logger";

export class FileApplicationRepository implements ApplicationRepository {
    private readonly applicationIconService: ApplicationIconService;
    private readonly logger: Logger;
    private config: ApplicationSearchOptions;
    private applications: Application[];

    constructor(applicationIconService: ApplicationIconService, config: ApplicationSearchOptions, logger: Logger) {
        this.applicationIconService = applicationIconService;
        this.applications = [];
        this.config = config;
        this.logger = logger;
    }

    public getAll(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            resolve(this.applications);
        });
    }

    public refreshIndex(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (this.config.applicationFolders === undefined || this.config.applicationFolders.length === 0) {
                this.applications = [];
                resolve();
            } else {
                FileHelpers.readFilesFromFoldersRecursively(this.config.applicationFolders)
                    .then((files) => {
                        if (files.length === 0) {
                            this.applications = [];
                            resolve();
                        }

                        const applications = uniq(files)
                            .filter((file) => this.filterByApplicationFileExtensions(file))
                            .map((applicationFile): Application => this.createApplicationFromFilePath(applicationFile));

                        this.applicationIconService.generateAppIcons(applications)
                            .then(() => {
                                // do nothing
                            })
                            .catch((err) => {
                                this.logger.error(err);
                            })
                            .finally(() => {
                                applications.forEach((application) => application.icon = getApplicationIconFilePath(application.filePath));
                                this.applications = applications;
                                resolve();
                            });
                    })
                    .catch((err) => reject(err));
            }
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.applicationIconService.clearCache()
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public updateConfig(updatedConfig: ApplicationSearchOptions): Promise<void> {
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
