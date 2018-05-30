import { ProgramFileRepository } from "../../ts/programs-plugin/program-file-repository";
import { mkdirSync, writeFileSync, unlinkSync, rmdirSync } from "fs";
import { join } from "path";

describe(ProgramFileRepository.name, (): void => {
    describe("getPrograms", (): void => {
        const applicationFileExtension = ".app";

        const applicationFolders = [
            "app-folder-1",
            "app-folder-2",
        ];

        const applicationFiles = [
            `app-1${applicationFileExtension}`,
            `app-2${applicationFileExtension}`,
            `app-3${applicationFileExtension}`,
        ];

        const otherFiles = [
            "other-file-1.txt",
            "other-file-2.json",
            "other-file-3.xml",
            "other-file-4",
        ];

        const allFiles = applicationFiles.concat(otherFiles);

        beforeEach((): void => {
            for (const applicationFolder of applicationFolders) {
                mkdirSync(applicationFolder);

                for (const file of allFiles) {
                    writeFileSync(join(applicationFolder, file), "", "utf-8");
                }
            }
        });

        afterEach((): void => {
            for (const applicationFolder of applicationFolders) {
                for (const file of allFiles) {
                    unlinkSync(join(applicationFolder, file));
                }

                rmdirSync(applicationFolder);
            }
        });

        it("should return all programs correctly", (): void => {
            const repo = new ProgramFileRepository(applicationFolders, [applicationFileExtension]);
            const programs = repo.getPrograms();

            expect(programs.length).toBe(applicationFiles.length * applicationFolders.length);
        });
    });
});
