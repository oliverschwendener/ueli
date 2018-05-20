import { ProgramFileRepository } from "../../../ts/programs-plugin/program-file-repository";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";

describe(ProgramFileRepository.name, (): void => {
    const applicationFileExtension = ".lnk";
    const applicationFolder = "test-folder";
    const applications = ["test-1", "test-2", "test-3"];

    describe("getPrograms", (): void => {
        beforeAll((): void => {
            mkdirSync(applicationFolder);

            for (const application of applications) {
                const filePath = getFilePath(applicationFolder, application, applicationFileExtension);
                writeFileSync(filePath, "", "utf-8");
            }
        });

        afterAll((): void => {
            for (const application of applications) {
                const filePath = getFilePath(applicationFolder, application, applicationFileExtension);
                unlinkSync(filePath);
            }

            rmdirSync(applicationFolder);
        });

        it("should return programs correctly", (): void => {
            const repo = new ProgramFileRepository([applicationFolder], [applicationFileExtension]);
            const programs = repo.getPrograms();
            expect(programs.length).toBe(applications.length);

            for (const program of programs) {
                const application = applications.filter((a) => {
                    return a === program.name;
                })[0];

                expect(application).not.toBe(undefined);
                expect(program.name).toBe(application);
                expect(program.executionArgument).toBe(getFilePath(applicationFolder, application, applicationFileExtension));
            }
        });
    });
});

function getFilePath(folder: string, file: string, fileExtension: string): string {
    return `${join(folder, file)}${fileExtension}`;
}
