import { IconSet } from "../icon-sets/icon-set";
import { Program } from "../programs-plugin/program";
import { ProgramRepository } from "../programs-plugin/program-repository";
import { SearchResultItem } from "../search-result-item";
import { SearchPlugin } from "./search-plugin";
import { FilePathDescriptionBuilder } from "../builders/file-path-description-builder";

export class ProgramsPlugin implements SearchPlugin {
    private programs: Program[];
    private iconSet: IconSet;

    public constructor(programRepository: ProgramRepository, iconSet: IconSet) {
        this.iconSet = iconSet;
        this.programs = programRepository.getPrograms();
    }

    public getIndexLength(): number {
        return this.programs.length;
    }

    public getAllItems(): SearchResultItem[] {
        return this.programs.map((program): SearchResultItem => {
            return {
                description: FilePathDescriptionBuilder.buildFilePathDescription(program.executionArgument),
                executionArgument: program.executionArgument,
                icon: this.iconSet.appIcon,
                name: program.name,
                searchable: [program.name],
                tags: [],
            } as SearchResultItem;
        });
    }
}
