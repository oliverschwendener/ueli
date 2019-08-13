import { Application } from "./application";
import { applicationIconLocation } from "./application-icon-helpers";
import { FileHelpers } from "../../../common/helpers/file-helpers";

export class ApplicationIconService {
    private readonly generateIcons: (applicationFilePaths: string[]) => Promise<void>;

    constructor(generateIcons: (applicationFilePaths: string[]) => Promise<void>) {
        this.generateIcons = generateIcons;
    }

    public generateAppIcons(applications: Application[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.generateIcons(applications.map((app) => app.filePath))
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            FileHelpers.readFilesFromFolder(applicationIconLocation)
                .then((files) => {
                    const deletionPromises = files.map((file) => FileHelpers.deleteFile(file));
                    Promise.all(deletionPromises)
                        .then(() => resolve())
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }
}
