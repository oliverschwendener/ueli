import * as path from "path";
import { CountLoader, Count } from "./count-loader";

let countLoader = new CountLoader();
let countStorage = countLoader.loadCountFromCountFile();

export class CountManager {
    public constructor(loader?: CountLoader) {
        if (loader !== undefined) {
            countLoader = loader;
            countStorage = loader.loadCountFromCountFile();
        }
    }

    public getCount(key: string): number {
        const score = countStorage[key];
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
            countStorage[key] = score;
            countLoader.writeCountFile(countStorage);
        }
    }

    public removeCountKey(key: string): void {
        delete countStorage[key];
        countLoader.writeCountFile(countStorage);
    }

    public getStorage(): Count {
        return countStorage;
    }

    public clearStorage(): void {
        countStorage = {} as Count;
        countLoader.writeCountFile(countStorage);
    }
}
