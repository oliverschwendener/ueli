import { Program } from "./program";

export interface ProgramRepository {
    getAll(): Promise<Program[]>;
    refreshIndex(): void;
}
