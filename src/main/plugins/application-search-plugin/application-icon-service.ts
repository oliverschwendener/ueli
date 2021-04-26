import { Application } from "./application";
import { applicationIconLocation, getApplicationIconFilePath } from "./application-icon-helpers";
import { FileHelpers } from "../../../common/helpers/file-helpers";
import { Logger } from "../../../common/logger/logger";

export class ApplicationIconService {
    private readonly generateIcons: (applicationFilePaths: string[]) => Promise<void>;
    private readonly logger: Logger;

    constructor(generateIcons: (applicationFilePaths: string[]) => Promise<void>, logger: Logger) {
        this.generateIcons = generateIcons;
        this.logger = logger;
    }

    public generateAppIcons(applications: Application[]): Promise<void> {
        return new Promise((resolve, reject) => {
            const fileExistPromises = applications.map((application) =>
                FileHelpers.fileExists(getApplicationIconFilePath(application.filePath)),
            );
            Promise.all(fileExistPromises)
                .then((fileExistResults) => {
                    const applicationsToGenerateIcons = applications.filter((application) => {
                        const fileExistsResult = fileExistResults.find(
                            (f) => f.filePath === getApplicationIconFilePath(application.filePath),
                        );
                        if (fileExistsResult) {
                            return !fileExistsResult.fileExists;
                        }
                        return false;
                    });

                    if (applicationsToGenerateIcons.length === 0) {
                        this.logger.debug(`Skipping app icon generation. All app icons already exist`);
                        resolve();
                    } else {
                        this.logger.debug(
                            `${applications.length - applicationsToGenerateIcons.length}/${
                                applications.length
                            } app icons already exist`,
                        );
                        this.logger.debug(
                            `Started to generate ${applicationsToGenerateIcons.length} app icons to ${applicationIconLocation}`,
                        );
                        this.generateIcons(applicationsToGenerateIcons.map((application) => application.filePath))
                            .then(() => {
                                this.logger.debug(`Successfully generated ${applicationsToGenerateIcons.length} icons`);
                                resolve();
                            })
                            .catch((err) => reject(err));
                    }
                })
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            FileHelpers.readFilesFromFolder(applicationIconLocation)
                .then((files) => {
                    const deletionPromises = files.map((file) => FileHelpers.deleteFile(file));
                    Promise.all(deletionPromises)
                        .then(() => {
                            this.logger.debug(`Deleted ${files.length} app icons in ${applicationIconLocation}`);
                            resolve();
                        })
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }
}
