import { Application } from "./application";
import { join } from "path";
import { applicationIconLocation } from "./application-icon-helpers";
import { FileHelpers } from "../../helpers/file-helpers";
import { ApplicationIcon } from "./application-icon";

export class ApplicationIconService {
    private readonly getAppIcons: (applications: Application[]) => Promise<ApplicationIcon[]>;

    constructor(getAppIcons: (applications: Application[]) => Promise<ApplicationIcon[]>) {
        this.getAppIcons = getAppIcons;
    }

    public getIcons(applications: Application[]): Promise<ApplicationIcon[]> {
        return new Promise((resolve, reject) => {
            this.getAppIcons(applications)
                .then((appIcons) => {
                    resolve(appIcons);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            FileHelpers.getFilesFromFolder(applicationIconLocation)
                .then((files) => {
                    const deletionPromises = files.map((file) => FileHelpers.deleteFile(join(applicationIconLocation, file)));
                    Promise.all(deletionPromises)
                        .then(() => {
                            resolve();
                        })
                        .catch((deletionError) => {
                            reject(deletionError);
                        });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
