import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { ApplicationRepository } from "./application-repository";

export class ApplicationSearchPlugin implements SearchPlugin {
    private readonly programRepository: ApplicationRepository;

    constructor(programRepository: ApplicationRepository) {
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
