import { ProgramsPlugin } from "../../../ts/search-plugins/programs-plugin";
import { platform } from "os";
import { WindowsProgramRepository } from "../../../ts/programs-plugin/windows-program-repository";
import { MacOsProgramRepository } from "../../../ts/programs-plugin/macos-program-repository";

describe(ProgramsPlugin.name, (): void => {
    const programRepo = platform() === "win32"
        ? new WindowsProgramRepository()
        : new MacOsProgramRepository();

    const plugin = new ProgramsPlugin(programRepo);

    describe(plugin.getAllItems.name, (): void => {
        it("should return some programs", (): void => {
            const programs = plugin.getAllItems();

            expect(programs.length).toBeGreaterThan(0);
        });

        it("all returned items should have set a name, execution argument and tags", (): void => {
            const programs = plugin.getAllItems();

            for (const program of programs) {
                expect(program).not.toBeUndefined();
                expect(program.name).not.toBeUndefined();
                expect(program.executionArgument).not.toBeUndefined();
                expect(program.icon).not.toBeUndefined();
                expect(program.tags).not.toBeUndefined();
            }
        });
    });
});
