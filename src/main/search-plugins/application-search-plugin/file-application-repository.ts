import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { FileHelpers } from "../../helpers/file-helpers";

export class FileApplicationRepository implements ApplicationRepository {
    private applications: Application[];
    private config: ApplicationSearchPluginOptions;

    constructor(config: ApplicationSearchPluginOptions) {
        this.applications = [];
        this.config = config;
    }

    public getAll(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            resolve(this.applications);
        });
    }

    public refreshIndex(): void {
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
                    .map((file) => this.createProgramFromFilePath(file));

                Promise.all(applicationPromises)
                    .then((applicationList) => {
                        this.applications = applicationList;
                    })
                    .catch((applicationError) => {
                        // tslint:disable-next-line:no-console
                        console.log(applicationError);
                    });
            })
            .catch((applicationError) => {
                // tslint:disable-next-line:no-console
                console.log(applicationError);
            });
    }

    private createProgramFromFilePath(filePath: string): Promise<Application> {
        return new Promise((resolve, reject) => {
            resolve({
                filePath,
                name: basename(filePath).replace(extname(filePath), ""),
            });
        });
    }

    private filterByApplicationFileExtensions(file: string): boolean {
        return this.config.applicationFileExtensions.indexOf(extname(file)) > -1;
    }
}
