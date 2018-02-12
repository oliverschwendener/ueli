import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { SearchPlugin } from "./search-plugin";
import { SearchResultItem } from "../search-engine";
import { FileHelpers } from "../helpers/file-helpers";
import { Injector } from "../injector";
import { IconManager } from "../icon-manager";

export class ProgramsPlugin implements SearchPlugin {
    private programs: Program[];
    private iconManager: IconManager;

    public constructor(programRepository?: ProgramRepository) {
        this.iconManager = Injector.getIconManager();

        if (programRepository === undefined) {
            programRepository = Injector.getProgramRepository();
        }

        this.programs = programRepository.getPrograms();
    }

    public getAllItems(): SearchResultItem[] {
        let result = [] as SearchResultItem[];

        for (let program of this.programs) {
            result.push(<SearchResultItem>{
                name: program.name,
                executionArgument: program.executionArgument,
                icon: this.iconManager.getProgramIcon(),
                tags: []
            });
        }

        return result;
    }
}

export class Program {
    public name: string;
    public executionArgument: string;
}

export interface ProgramRepository {
    getPrograms(): Program[];
}

export class FakeProgramRepository implements ProgramRepository {
    private programs: Program[];

    public constructor(programs: Program[]) {
        this.programs = programs;
    }

    public getPrograms(): Program[] {
        return this.programs;
    }
}

export class WindowsProgramRepository implements ProgramRepository {
    private programs: Program[];
    private folders = [
        "C:\\ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        `${os.homedir()}\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs`,
        `${os.homedir()}\\Desktop`
    ];
    private shortcutFileExtensions = [".lnk", ".appref-ms", ".url"];

    public constructor() {
        this.programs = this.loadPrograms();
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(): Program[] {
        let result = [] as Program[];

        let files = FileHelpers.getFilesFromFoldersRecursively(this.folders);

        for (let file of files) {
            for (let shortcutFileExtension of this.shortcutFileExtensions) {
                if (file.endsWith(shortcutFileExtension)) {
                    result.push(<Program>{
                        executionArgument: file,
                        name: path.basename(file).replace(shortcutFileExtension, ""),
                    });
                }
            }
        }

        return result;
    }
}

export class MacOsProgramRepository implements ProgramRepository {
    private folder = "/Applications";
    private applicationFileExtension = ".app";
    private programs: Program[];

    public constructor() {
        this.programs = this.loadPrograms();
    }

    public getPrograms(): Program[] {
        return this.programs;
    }

    private loadPrograms(): Program[] {
        let result = [] as Program[];

        let files = FileHelpers.getFilesFromFolderRecursively(this.folder);

        for (let file of files) {
            if (!file.endsWith(this.applicationFileExtension))
                continue;

            result.push(<Program>{
                name: path.basename(file).replace(this.applicationFileExtension, ""),
                executionArgument: file,
            });
        }

        return result;
    }
}