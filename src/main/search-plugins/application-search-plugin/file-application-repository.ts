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

            const programPromises = files
            .filter((file) => this.filterByApplicationFileExtensions(file))
            .map((file) => this.createProgramFromFilePath(file));

            Promise.all(programPromises).then((programList) => {
                this.programs = programList;
            });
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
