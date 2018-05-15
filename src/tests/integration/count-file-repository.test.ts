import { writeFileSync, unlinkSync, existsSync } from "fs";
import { Count } from "../../ts/count";
import { CountFileRepository } from "../../ts/count-file-repository";

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
    });

    describe("getScore", (): void => {
        it("should get the score of an execution argument from the count file", (): void => {
            const countFileRepository = new CountFileRepository(countFilePath);

            for (const key of ["a", "b", "c"]) {
                const acutal = countFileRepository.getScore(key);
                expect(acutal).toBe(expectedCount[key]);
            }
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
                const actual = countRepository.getScore(key);
                expect(actual).toBe(newCount[key]);
            }
        });
    });
});
