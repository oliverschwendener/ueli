import * as os from "os";
import * as path from "path";
import { FileHelpers } from "./../helpers/file-helpers";
import { Program } from "./program";
import { ProgramRepository } from "./program-repository";

export class WindowsProgramRepository implements ProgramRepository {
    private programs: Program[];
    private folders = [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu`,
        `${os.homedir()}\\Desktop`,
    ];
    private shortcutFileExtensions = [".lnk", ".appref-ms", ".url"];

    public constructor() {
        this.programs = this.loadPrograms();
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(): Program[] {
        const result = [] as Program[];

        const files = FileHelpers.getFilesFromFoldersRecursively(this.folders);

        for (const file of files) {
            for (const shortcutFileExtension of this.shortcutFileExtensions) {
                if (file.endsWith(shortcutFileExtension)) {
                    result.push({
                        executionArgument: file,
                        name: path.basename(file).replace(shortcutFileExtension, ""),
                    } as Program);
                }
            }
        }

        return result;
    }
}
