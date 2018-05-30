import { writeFileSync, unlinkSync, existsSync, writeSync } from "fs";
import { Count } from "../../ts/count";
import { CountFileRepository } from "../../ts/count-file-repository";
import { join } from "path";

describe("CountFileRepository", (): void => {
    const countFilePath = "./count-file.json";
    const expectedCount: Count = {
        a: 1,
        b: 2,
        c: 3,
    };

    beforeEach((): void => {
        writeFileSync(countFilePath, JSON.stringify(expectedCount), "utf-8");
    });

    afterEach((): void => {
        unlinkSync(countFilePath);
    });

    describe("getCount", (): void => {
        it("should read count from the count file", (): void => {
            const countFileRepository = new CountFileRepository(countFilePath);

            const actual = countFileRepository.getCount();

            expect(actual.a).toBe(expectedCount.a);
            expect(actual.b).toBe(expectedCount.b);
            expect(actual.c).toBe(expectedCount.c);
        });

        it("should return an empty count if there is an error while reading the count file", (): void => {
            writeFileSync(countFilePath, "this is invalid json", "utf-8");
            const repo = new CountFileRepository(countFilePath);
            const actual = repo.getCount();
            expect(actual).toEqual({});
        });
    });

    describe("updateCount", (): void => {
        it("should update the count file with a specified count", (): void => {
            const newCount: Count = {
                a: 2,
                b: 4,
                c: 6,
            };

            const countRepository = new CountFileRepository(countFilePath);

            countRepository.updateCount(newCount);

            for (const key of ["a", "b", "c"]) {
                const actual = countRepository.getCount()[key];
                expect(actual).toBe(newCount[key]);
            }
        });
    });

    describe("constructor", (): void => {
        const filePath = join(__dirname, "this-file-does-not-exist");

        it("should create the count file if it does not exist yet", (): void => {
            const countRepository = new CountFileRepository(filePath);
            const fileExists = existsSync(filePath);
            expect(fileExists).toBe(true);
        });

        afterAll((): void => {
            unlinkSync(filePath);
        });
    });
});
