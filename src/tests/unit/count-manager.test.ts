import { CountManager } from "../../ts/count-manager";
import { FakeCountRepository } from "./fake-count-repository";
import { exec } from "child_process";
import { Count } from "../../ts/count";

describe("CountManager", (): void => {
    describe("increaseCount", (): void => {
        it("should add key if key does not exists yet and set it to 1", (): void => {
            const count = {} as Count;

            const countRepo = new FakeCountRepository(count);
            const countManager = new CountManager(countRepo);

            const executionArgument = "some-exec-arg";

            countManager.increaseCount(executionArgument);

            const acutal = countRepo.getCount();

            expect(acutal[executionArgument]).toBe(1);
        });

        it("should increase existing key by 1 if key already exists", (): void => {
            const score = 14;

            const fakeCount: Count = {
                "some-exec-arg": score,
            };

            const countRepo = new FakeCountRepository(fakeCount);
            const countManager = new CountManager(countRepo);

            countManager.increaseCount("some-exec-arg");

            const acutal = countRepo.getCount();

            expect(acutal["some-exec-arg"]).toBe(score + 1);
        });
    });
});
