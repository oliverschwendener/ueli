import * as os from "os";
import * as path from "path";
import { FileHelpers } from "./../helpers/file-helpers";
import { Program } from "./program";
import { ProgramRepository } from "./program-repository";
import { Config } from "../config";

export class WindowsProgramRepository implements ProgramRepository {
    private programs: Program[];
    private shortcutFileExtensions = [".lnk", ".appref-ms", ".url"];

    public constructor() {
        this.programs = this.loadPrograms();
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(): Program[] {
        const result = [] as Program[];

        const files = FileHelpers.getFilesFromFoldersRecursively(Config.applicationFolders);

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
