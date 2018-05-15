import { CountRepository } from "./count-repository";
import { Count } from "./count";
import { readFileSync, writeFileSync } from "fs";

export class CountFileRepository implements CountRepository {
    private countFilePath: string;

    constructor(countFilePath: string) {
        this.countFilePath = countFilePath;
    }

    public getCount(): Count {
        return this.getCountFromFile();
    }

    public getScore(key: string): number {
        const count = this.getCountFromFile();
        return count[key];
    }

    public updateCount(count: Count): void {
        this.writeCountToFile(count);
    }

    private getCountFromFile(): Count {
        const fileContent = readFileSync(this.countFilePath, "utf-8");
        const count = JSON.parse(fileContent) as Count;
        return count;
    }

    private writeCountToFile(count: Count): void {
        const stringifiedCount = JSON.stringify(count, null, 2);
        writeFileSync(this.countFilePath, stringifiedCount, "utf-8");
    }
}
