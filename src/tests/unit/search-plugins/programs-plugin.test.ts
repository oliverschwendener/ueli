import { Program } from "../../../ts/programs-plugin/program";
import { FakeProgramRepository } from "./../../../ts/programs-plugin/fake-program-repository";
import { ProgramsPlugin } from "./../../../ts/search-plugins/programs-plugin";
import { testIconSet } from "../../../ts/icon-sets/test-icon-set";

function getTestPrograms(programNames: string[]) {
    return programNames.map((p): Program => {
        return {
            executionArgument: `C:\\Some\\Dummy\\FilePath\\${p}`,
            name: p,
        } as Program;
    });
}

describe("ProgramsPlugin", (): void => {
    const fakePrograms = getTestPrograms([
        "Git Bash",
        "Adobe Premiere Pro",
        "FL Studio (64-bit)",
        "Native Instruments Maschine 2",
        "Visual Studio Code",
    ]);

    const fakeProgramRepository = new FakeProgramRepository(fakePrograms);
    const programsPlugin = new ProgramsPlugin(fakeProgramRepository, testIconSet);

    describe(programsPlugin.getAllItems.name, (): void => {
        it("should return all programs", (): void => {
            const actual = programsPlugin.getAllItems();

            expect(actual.length).toBeGreaterThan(0);

            for (const fakeProgram of fakePrograms) {
                const filtered = actual.filter((a): boolean => {
                    return a.name === fakeProgram.name;
                });

                expect(filtered.length).toBe(1);
                expect(filtered[0].name).toBe(fakeProgram.name);
                expect(filtered[0].executionArgument).toBe(fakeProgram.executionArgument);
            }
        });
    });

    describe(programsPlugin.getIndexLength.name, (): void => {
        it("should return the number of programs", (): void => {
            const actual = programsPlugin.getIndexLength();
            const expected = fakePrograms.length;

            expect(actual).toBe(expected);
        });
    });
});
