import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface Count {
    [key: string]: number;
}

let countFilePath = path.join(process.cwd(), "ueli.countstorage.json");

export class CountLoader {
    public constructor(filePath?: string) {
        if (filePath !== undefined) {
            countFilePath = filePath;
        }
    }

    public loadCountFromCountFile(): Count {
        try {
            const fileContent = fs.readFileSync(countFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as Count;
            return parsed;
        } catch (err) {
            fs.writeFileSync(countFilePath, "{}", "utf-8");
            return {};
        }
    }

    public writeCountFile(storage: Count): void {
        const stringifiedStorage = JSON.stringify(storage);
        fs.writeFileSync(countFilePath, stringifiedStorage, "utf-8");
    }
}
