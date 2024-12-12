import type { FileSearcher } from "../FileSearcher";

export class LinuxFileSearcher implements FileSearcher {
    public getFilePathsBySearchTerm(): Promise<string[]> {
        return Promise.reject("Method not implemented.");
    }
}
