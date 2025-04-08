import type { FileSystemUtility } from "@Core/FileSystemUtility";

export class CustomSettingsFilePathValidator {
    public constructor(private readonly fileSystemUtility: FileSystemUtility) {}

    public validate(filePath: string): boolean {
        if (!this.fileSystemUtility.existsSync(filePath)) {
            return false;
        }

        try {
            this.fileSystemUtility.readJsonFileSync(filePath);
            return true;
        } catch (error) {
            return false;
        }
    }
}
