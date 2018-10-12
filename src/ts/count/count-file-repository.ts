import { CountRepository } from "./count-repository";
import { Count } from "./count";
import { readFileSync, writeFileSync, existsSync } from "fs";

export class CountFileRepository implements CountRepository {
    private readonly countFilePath: string;

    constructor(countFilePath: string) {
        this.countFilePath = countFilePath;

        if (!existsSync(this.countFilePath)) {
            this.writeCountToFile({});
        }
    }

    public getCount(): Count {
        return this.getCountFromFile();
    }

    public updateCount(count: Count): void {
        this.writeCountToFile(count);
    }

    private getCountFromFile(): Count {
        try {
            const fileContent = readFileSync(this.countFilePath, "utf-8");
            return JSON.parse(fileContent) as Count;
        } catch (error) {
            return {};
        }
    }

    private writeCountToFile(count: Count): void {
        const stringifiedCount = JSON.stringify(count, null, 2);
        writeFileSync(this.countFilePath, stringifiedCount, "utf-8");
    }
}
