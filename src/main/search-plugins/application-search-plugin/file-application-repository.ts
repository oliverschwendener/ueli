import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchPluginOptions } from "./application-search-plugin-options";
import { FileHelpers } from "../../helpers/file-helpers";

export class FileApplicationRepository implements ApplicationRepository {
    private programs: Application[];
    private config: ApplicationSearchPluginOptions;

    constructor(config: ApplicationSearchPluginOptions) {
        this.programs = [];
        this.config = config;
    }

    public getAll(): Promise<Application[]> {
        return new Promise((resolve, reject) => {
            resolve(this.programs);
        });
    }

    public refreshIndex(): void {
        const promises = this.config.applicationFolders.map((applicationFolder) => {
            return FileHelpers.readFilesFromFolderRecursively(applicationFolder);
        });

        Promise.all(promises).then((fileLists) => {
            let files: string[] = [];
            fileLists.forEach((fileList) => {
                files = files.concat(fileList);
            });

            this.programs = [];
            files
                .filter((file) => this.filterByApplicationFileExtensions(file))
                .forEach((file) => this.programs.push(this.createProgramFromFilePath(file)));
        });
    }

    private createProgramFromFilePath(filePath: string): Application {
        return {
            filePath,
            name: basename(filePath).replace(extname(filePath), ""),
        };
    }

    private filterByApplicationFileExtensions(file: string): boolean {
        return this.config.applicationFileExtensions.indexOf(extname(file)) > -1;
    }
}
