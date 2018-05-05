import * as fs from "fs";
import { WeightManager } from "./../../ts/weight-manager";

const testWeightKey = "C:\\Path\\To\\File.exe";
const testWeightFilePath = "./test-weight-file.json";

describe("WeightManager", (): void => {
    it("Should reset invalid value of path to 1", (): void => {
        WeightManager.weightStorage[testWeightKey] = "lmao";
        WeightManager.addWeightScore(testWeightKey);
        expect(WeightManager.weightStorage[testWeightKey]).toBe(1);
    });

    it("Should reset increase score of path to 2", (): void => {
        WeightManager.addWeightScore(testWeightKey);
        expect(WeightManager.weightStorage[testWeightKey]).toBe(2);
    });

    it("Should return an empty object", (): void => {
        const content = WeightManager.loadWeightFromWeightFile(testWeightFilePath);
        expect(JSON.stringify(content)).toBe("{}");
    });

    afterAll((): void => {
        WeightManager.removeWeightKey(testWeightKey);
        fs.unlink(testWeightFilePath);
    });
});
