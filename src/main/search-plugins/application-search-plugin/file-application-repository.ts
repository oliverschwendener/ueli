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

                    const applicationPromises = files
                        .filter((file) => this.filterByApplicationFileExtensions(file))
                        .map((file) => this.createApplicationFromFilePath(file));

                    Promise.all(applicationPromises)
                        .then((applicationList) => {
                            this.applications = applicationList;
                            resolve();
                        })
                        .catch((applicationError) => {
                            reject(applicationError);
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

    private createApplicationFromFilePath(filePath: string): Promise<Application> {
        return new Promise((resolve, reject) => {
            const application = {
                filePath,
                icon: "",
                name: basename(filePath).replace(extname(filePath), ""),
            };

            this.applicationIconService.getIcon(application)
                .then((pngFilePath) => {
                    application.icon = pngFilePath;
                    resolve(application);
                })
                .catch(() => {
                    resolve(application);
                });
        });
    }

    private filterByApplicationFileExtensions(file: string): boolean {
        return this.config.applicationFileExtensions.indexOf(extname(file)) > -1;
    }
}
