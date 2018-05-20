import * as path from "path";
import { FileHelpers } from "../helpers/file-helpers";
import { Program } from "./program";
import { ProgramRepository } from "./program-repository";

export class ProgramFileRepository implements ProgramRepository {
    private applicationFileExtensions: string[];
    private programs: Program[];

    public constructor(applicationFolders: string[], applicationFileExtensions: string[]) {
        this.applicationFileExtensions = applicationFileExtensions;
        this.programs = this.loadPrograms(applicationFolders);
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(applicationFolders: string[]): Program[] {
        const result = [] as Program[];

        const files = FileHelpers.getFilesFromFoldersRecursively(applicationFolders);

        for (const file of files) {
            for (const applicationFileExtension of this.applicationFileExtensions) {
                if (file.endsWith(applicationFileExtension)) {
                    result.push({
                        executionArgument: file,
                        name: path.basename(file).replace(applicationFileExtension, ""),
                    } as Program);
                }
            }
        }

        return result;
    }
}
