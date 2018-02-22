import { expect } from "chai";
import { ProgramsPlugin } from "../../../ts/search-plugins/programs-plugin";

describe(ProgramsPlugin.name, (): void => {
    const plugin = new ProgramsPlugin();

    describe(plugin.getAllItems.name, (): void => {
        it("should return some programs", (): void => {
            const programs = plugin.getAllItems();

            expect(programs.length).to.be.greaterThan(0);
        });

        it("all returned items should have set a name, execution argument and tags", (): void => {
            const programs = plugin.getAllItems();

            for (const program of programs) {
                expect(program).not.to.be.undefined;
                expect(program.name).not.to.be.undefined;
                expect(program.executionArgument).not.to.be.undefined;
                expect(program.icon).not.to.be.undefined;
                expect(program.tags).not.to.be.undefined;
            }
        });
    });
});
