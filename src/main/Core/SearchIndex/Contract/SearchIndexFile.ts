import type { Index } from "./SearchIndexStructure";

export interface SearchIndexFile {
    getPath(): string;
    exists(): boolean;
    read(): Index;
    write(index: Index): void;
}
