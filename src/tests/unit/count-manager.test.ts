import * as fs from "fs";
import { CountManager } from "./../../ts/count-manager";
import { CountLoader } from "./../../ts/count-loader";

const testStorage = {
    "C:\\Path\\To\\Exe.exe": 10,
    "D:\\Test\\Path": 40,
    "E:\\Invalid\\Value": "lol",
};

const testLoader = {
    loadCountFromCountFile: (): any => testStorage,
    writeCountFile: (): void => {/* do nothing */},
} as CountLoader;

describe("CountManager", (): void => {
    const count = new CountManager(testLoader);

    it("Should set value of new path to 1", (): void => {
        count.addCount("F:\\New\\Path");
        expect(count.getCount("F:\\New\\Path")).toBe(1);
    });

    it("Should increase score of path to 11", (): void => {
        count.addCount("C:\\Path\\To\\Exe.exe");
        expect(count.getCount("C:\\Path\\To\\Exe.exe")).toBe(11);
    });

    it("Should keep score of path at 40", (): void => {
        count.addCount("D:\\Test\\Path");
        expect(count.getCount("D:\\Test\\Path")).toBe(40);
    });

    it("Should return an empty object after clearStorage",  (): void => {
        count.clearStorage();
        expect(Object.keys(count.getStorage()).length).toBe(0);
    });
});

describe("CountLoader", (): void => {
    const testCountFilePath = "./test.countstorage.json";
    const loader = new CountLoader(testCountFilePath);

    it("Should return an empty object", (): void => {
        const storage = loader.loadCountFromCountFile();
        expect(Object.keys(storage).length).toBe(0);
    });

    afterAll((): void => {
        fs.unlink(testCountFilePath);
    });
});
