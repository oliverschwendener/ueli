import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface Count {
    [key: string]: number;
}

export class CountLoader {
    private countFilePath = path.join(process.cwd(), "ueli.countstorage.json");

    public constructor(filePath?: string) {
        if (filePath !== undefined) {
            this.countFilePath = filePath;
        }
    }

    public loadCountFromCountFile(): Count {
        try {
            const fileContent = fs.readFileSync(this.countFilePath, "utf-8");
            const parsed = JSON.parse(fileContent) as Count;
            return parsed;
        } catch (err) {
            fs.writeFileSync(this.countFilePath, "{}", "utf-8");
            return {};
        }
    }

    public writeCountFile(storage: Count): void {
        const stringifiedStorage = JSON.stringify(storage);
        fs.writeFileSync(this.countFilePath, stringifiedStorage, "utf-8");
    }
}
