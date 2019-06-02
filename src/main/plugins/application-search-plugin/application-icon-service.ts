import { Application } from "./application";
import { join } from "path";
import { applicationIconLocation } from "./application-icon-helpers";
import { FileHelpers } from "../../../common/helpers/file-helpers";

export class ApplicationIconService {
    private readonly generateIcons: (applications: Application[]) => Promise<void>;

    constructor(generateIcons: (applications: Application[]) => Promise<void>) {
        this.generateIcons = generateIcons;
    }

    public async generateAppIcons(applications: Application[]): Promise<void> {
        try {
            await this.generateIcons(applications);
        } catch (error) {
            return error;
        }
    }

    public async clearCache(): Promise<void> {
        try {
            const files = await FileHelpers.readFilesFromFolder(applicationIconLocation);
            const deletionPromises = files.map((file) => FileHelpers.deleteFile(join(applicationIconLocation, file)));
            await Promise.all(deletionPromises);
        } catch (error) {
            return error;
        }
    }
}
