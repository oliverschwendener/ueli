import { Program } from "./program";

export interface ProgramRepository {
    getPrograms(): Program[];
}
