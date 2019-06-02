import { ApplicationRepository } from "./application-repository";
import { Application } from "./application";
import { basename, extname } from "path";
import { ApplicationSearchOptions } from "./application-search-options";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { ApplicationIconService } from "./application-icon-service";
import { getApplicationIconFilePath } from "./application-icon-helpers";
import { uniq } from "lodash";

export class FileApplicationRepository implements ApplicationRepository {
    private readonly applicationIconService: ApplicationIconService;
    private config: ApplicationSearchOptions;
    private applications: Application[];

    constructor(applicationIconService: ApplicationIconService, config: ApplicationSearchOptions) {
        this.applicationIconService = applicationIconService;
        this.applications = [];
        this.config = config;
    }

    public async getAll(): Promise<Application[]> {
        return this.applications;
    }

    public async refreshIndex(): Promise<void> {
        try {
            if (this.config.applicationFolders === undefined || this.config.applicationFolders.length === 0) {
                this.applications = [];
            } else {
                const files = await FileHelpers.readFilesFromFoldersRecursively(this.config.applicationFolders);
                if (files.length === 0) {
                    this.applications = [];
                    return;
                } else {
                    const applications = uniq(files)
                        .filter((file) => this.filterByApplicationFileExtensions(file))
                        .map((applicationFile): Application => this.createApplicationFromFilePath(applicationFile));

                    this.applicationIconService.generateAppIcons(applications);
                    applications.forEach((application) => application.icon = getApplicationIconFilePath(application));
                    this.applications = applications;
                }
            }
        } catch (error) {
            return error;
        }
    }

    public async clearCache(): Promise<void> {
        try {
            await this.applicationIconService.clearCache();
        } catch (error) {
            return error;
        }
    }

    public async updateConfig(updatedConfig: ApplicationSearchOptions): Promise<void> {
        this.config = updatedConfig;
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
