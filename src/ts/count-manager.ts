import * as fs from "fs";
import * as os from "os";
import * as path from "path";

interface Count {
    [key: string]: number;
}

const countFilePath = path.join(process.cwd(), "ueli.countstorage.json");

export class CountManager {
    private storage: Count;
    private storageFilePath: string;

    public constructor(filePath?: string) {
        this.storageFilePath = filePath || countFilePath;
        this.storage = this.loadCountFromCountFile();
    }

    public getCount(key: string): number {
        const score = this.getStorage()[key];
        if (isNaN(score)) {
            return 0;
        } else {
            return score;
        }
    }

    public addCount(key: string): void {
        let score = this.getCount(key);
        score++;
        if (score <= 40) {
            this.storage[key] = score;
            this.writeCountFile();
        }
    }

    public removeCountKey(key: string): void {
        delete this.storage[key];
        this.writeCountFile();
    }

    public getStorage(): Count {
        return this.storage;
    }

    public clearStorage(): void {
        this.storage = {};
        this.writeCountFile();
    }

    private loadCountFromCountFile(): Count {
        try {
            const fileContent = fs.readFileSync(this.storageFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as Count;
            return parsed;
        } catch (err) {
            fs.writeFileSync(this.storageFilePath, "{}", "utf-8");
            return {};
        }
    }

    private writeCountFile(): void {
        const stringifiedStorage = JSON.stringify(this.storage);
        fs.writeFileSync(this.storageFilePath, stringifiedStorage, "utf-8");
    }
}
