import { Application } from "./application";
import { join } from "path";
import { applicationIconLocation } from "./application-icon-helpers";
import { FileHelpers } from "../../../common/helpers/file-helpers";

export class ApplicationIconService {
    private readonly generateIcons: (applications: Application[]) => Promise<void>;

    constructor(generateIcons: (applications: Application[]) => Promise<void>) {
        this.generateIcons = generateIcons;
    }

    public generateAppIcons(applications: Application[]): Promise<void> {
        return new Promise((resolve, reject) => {
            this.generateIcons(applications)
                .then(() => resolve())
                .catch((err) => reject(err));
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            FileHelpers.readFilesFromFolder(applicationIconLocation)
                .then((files) => {
                    const deletionPromises = files.map((file) => FileHelpers.deleteFile(join(applicationIconLocation, file)));
                    Promise.all(deletionPromises)
                        .then(() => resolve())
                        .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
        });
    }
}
