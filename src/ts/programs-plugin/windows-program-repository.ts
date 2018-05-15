import * as os from "os";
import * as path from "path";
import { FileHelpers } from "./../helpers/file-helpers";
import { Program } from "./program";
import { ProgramRepository } from "./program-repository";

export class WindowsProgramRepository implements ProgramRepository {
    private programs: Program[];
    private shortcutFileExtensions = [".lnk", ".appref-ms", ".url"];

    public constructor(applicationFolders: string[]) {
        this.programs = this.loadPrograms(applicationFolders);
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(applicationFolders: string[]): Program[] {
        const result = [] as Program[];

        const files = FileHelpers.getFilesFromFoldersRecursively(applicationFolders);

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
