import { expect } from "chai";
import { ProgramsPlugin, WindowsProgramRepository } from "./../../src/ts/search-plugins/programs-plugin";

describe("ProgramsPlugin", (): void => {
    describe("getAllItems", (): void => {
        it("should return some programs", (): void => {
            let programsPlugin = new ProgramsPlugin();

            let programs = programsPlugin.getAllItems();

            expect(programs.length).to.be.greaterThan(0);
        });

        it("all returned items should have set a name, execution argument and tags", (): void => {
            let programsPlugin = new ProgramsPlugin();

            let programs = programsPlugin.getAllItems();

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