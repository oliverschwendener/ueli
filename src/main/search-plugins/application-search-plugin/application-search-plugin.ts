import { SearchPlugin } from "../../search-plugin";
import { SearchResultItem } from "../../../common/search-result-item";
import { ApplicationRepository } from "./application-repository";

export class ApplicationSearchPlugin implements SearchPlugin {
    private readonly applicationRepository: ApplicationRepository;

    constructor(applicationRepository: ApplicationRepository) {
        this.applicationRepository = applicationRepository;
    }

    public getAll(): Promise<SearchResultItem[]> {
        return new Promise((resolve, reject) => {
            this.applicationRepository.getAll()
                .then((applications) => {
                    const result = applications.map((application): SearchResultItem => {
                        return {
                            executionArgument: application.filePath,
                            icon: application.icon,
                            name: application.name,
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
        this.applicationRepository.refreshIndex();
    }
}
