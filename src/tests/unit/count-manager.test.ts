import * as fs from "fs";
import { CountManager } from "./../../ts/count-manager";

const testCounttKey = "C:\\Path\\To\\File.exe";
const testCountFilePath = "./test-count-file.json";

describe("CountManager", (): void => {
    const count = new CountManager(testCountFilePath);

    it("Should return an empty object", (): void => {
        expect(Object.keys(count.getStorage()).length).toBe(0);
    });

    it("Should set value of new path to 1", (): void => {
        count.addCount(testCounttKey);
        expect(count.getCount(testCounttKey)).toBe(1);
    });

    it("Should increase score of path to 2", (): void => {
        count.addCount(testCounttKey);
        expect(count.getCount(testCounttKey)).toBe(2);
    });

    it("Should keep score of path at 40", (): void => {
        count.getStorage()[testCounttKey] = 40;
        count.addCount(testCounttKey);
        expect(count.getCount(testCounttKey)).toBe(40);
    });

    it("Should return an empty object after clearStorage",  (): void => {
        count.clearStorage();
        expect(Object.keys(count.getStorage()).length).toBe(0);
    });

    afterAll((): void => {
        fs.unlink(testCountFilePath);
    });
});
