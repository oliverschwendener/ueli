import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { FileHelpers } from "../../helpers/file-helpers";
import { ApplicationIconService } from "./application-icon-service";

export class FileApplicationRepository implements ApplicationRepository {
    private readonly applicationIconService: ApplicationIconService;
    private readonly config: ApplicationSearchPluginOptions;
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
            const applicationFilePromises = this.config.applicationFolders.map((applicationFolder) => {
                return FileHelpers.readFilesFromFolderRecursively(applicationFolder);
            });

            Promise.all(applicationFilePromises)
                .then((fileLists) => {
                    let files: string[] = [];
                    fileLists.forEach((fileList) => {
                        files = files.concat(fileList);
                    });

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
                .catch((applicationError) => {
                    reject(applicationError);
                });
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
