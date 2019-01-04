import { ApplicationIconService } from "./application-icon-service";
import { Application } from "./application";
import { convert } from "app2png";
import { homedir } from "os";
import { join } from "path";
import { exists, readdir, unlink } from "fs";
import { createHash } from "crypto";

const applicationIconLocation = join(homedir(), ".ueli", "application-icons");

export class MacOsApplicationIconService implements ApplicationIconService {
    public getIcon(application: Application): Promise<string> {
        return new Promise((resolve, reject) => {
            exists(this.getApplicationIconFilePath(application), (pngExists) => {
                if (pngExists) {
                    resolve(this.getApplicationIconFilePath(application));
                } else {
                    convert(application.filePath, this.getApplicationIconFilePath(application))
                        .then(() => {
                            resolve(this.getApplicationIconFilePath(application));
                        })
                        .catch((err) => {
                            reject(`Error while generating icon for ${application.name}: ${err}`);
                        });
                }
            });
        });
    }

    public clearCache(): Promise<void> {
        return new Promise((resolve, reject) => {
            readdir(applicationIconLocation, (err, files) => {
                if (err) {
                    reject(err);
                }
                const deletionPromises = files.map((file) => this.deleteFile(join(applicationIconLocation, file)));
                Promise.all(deletionPromises)
                    .then(() => {
                        resolve();
                    })
                    .catch((deletionError) => {
                        reject(deletionError);
                    });
            });
        });
    }

    private getApplicationIconFilePath(application: Application): string {
        return `${join(applicationIconLocation, createHash("md5").update(application.name).digest("hex"))}.png`;
    }

    private deleteFile(filePath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            unlink(filePath, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
}
