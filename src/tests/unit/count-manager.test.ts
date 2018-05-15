import { CountManager } from "../../ts/count-manager";
import { FakeCountRepository } from "./fake-count-repository";
import { exec } from "child_process";
import { Count } from "../../ts/count";

describe("CountManager", (): void => {
    describe("increaseCount", (): void => {
        it("should add key if key does not exists yet and set it to 1", (): void => {
            const executionArgument = "some-exec-arg";
            const count: Count = {};
            const countRepo = new FakeCountRepository(count);
            const countManager = new CountManager(countRepo);

            countManager.increaseCount(executionArgument);

            const acutal = countRepo.getCount();
            expect(acutal[executionArgument]).toBe(1);
        });

        it("should increase existing key by 1 if key already exists", (): void => {
            const score = 1138;
            const fakeCount: Count = { "some-exec-arg": score };
            const countRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(countRepo);

            countManager.increaseCount("some-exec-arg");

            const acutal = countRepo.getCount();
            expect(acutal["some-exec-arg"]).toBe(score + 1);
        });
    });

    describe("getScore", (): void => {
        it("should return 0 if execution argument is not in count repo", (): void => {
            const executionArgument = "some-exec-arg";
            const fakeCount: Count = {};
            const fakeRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeRepo);

            const actual = countManager.getScore(executionArgument);

            expect(actual).toBe(0);
        });

        it("should return the correct score of execution argument if execution argument is in count repo", (): void => {
            const score = 1138;
            const fakeCount: Count = { "some-exec-arg": score };
            const fakeRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(fakeRepo);

            const actual = countManager.getScore("some-exec-arg");

            expect(actual).toBe(score);
        });
    });
});
