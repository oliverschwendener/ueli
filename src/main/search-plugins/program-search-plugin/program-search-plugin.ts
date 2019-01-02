import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { ProgramRepository } from "./program-repository";

export class ProgramSearchPlugin implements SearchPlugin {
    private readonly programRepository: ProgramRepository;

    constructor(programRepository: ProgramRepository) {
        this.programRepository = programRepository;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            this.programRepository.getAll()
                .then((programs) => {
                    const result = programs.map((program): SearchResultItem => {
                        return {
                            executionArgument: program.filePath,
                            name: program.name,
                        };
                    });
                    resolve(result);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }

    public refreshIndex(): void {
        this.programRepository.refreshIndex();
    }
}
