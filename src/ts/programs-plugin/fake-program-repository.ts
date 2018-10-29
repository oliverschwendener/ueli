import { Program } from "./program";
import { ProgramRepository } from "./program-repository";

export class FakeProgramRepository implements ProgramRepository {
    private readonly programs: Program[];

    public constructor(programs: Program[]) {
        this.programs = programs;
    }

    public getPrograms(): Program[] {
        return this.programs;
    }
}
