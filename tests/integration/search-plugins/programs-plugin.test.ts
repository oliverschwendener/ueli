import { expect } from "chai";
import { ProgramsPlugin, WindowsProgramRepository } from "../../../src/ts/search-plugins/programs-plugin";

describe(ProgramsPlugin.name, (): void => {
    let plugin = new ProgramsPlugin();

    describe(plugin.getAllItems.name, (): void => {
        it("should return some programs", (): void => {
            let programs = plugin.getAllItems();

            expect(programs.length).to.be.greaterThan(0);
        });

        it("all returned items should have set a name, execution argument and tags", (): void => {
            let programs = plugin.getAllItems();

            for (let program of programs) {
                expect(program).not.to.be.undefined;
                expect(program.name).not.to.be.undefined;
                expect(program.executionArgument).not.to.be.undefined;
                expect(program.icon).not.to.be.undefined;
                expect(program.tags).not.to.be.undefined;
            }
        });
    });
});