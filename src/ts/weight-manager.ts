import * as fs from "fs";
import * as os from "os";
import * as path from "path";

export interface Weight {
    [key: string]: number;
}

const weightFilePath = path.join(os.homedir(), "ueli.weightstorage.json");

function writeWeightFile(filePath: string): void {
    const stringifiedWeight = JSON.stringify(WeightManager.weightStorage);
    fs.writeFileSync(filePath, stringifiedWeight, "utf-8");
}

export class WeightManager {

    public static readonly weightStorage = WeightManager.loadWeightFromWeightFile(weightFilePath);

    public static loadWeightFromWeightFile(filePath: string): Weight {
        try {
            const fileContent = fs.readFileSync(filePath, "utf-8");
            const parsed = JSON.parse(fileContent) as Weight;
            return parsed;
        } catch (err) {
            fs.writeFileSync(filePath, "{}", "utf-8");
            return {};
        }
    }

    public static addWeightScore(key: string): void {
        let score = this.weightStorage[key];
        if (score === undefined || isNaN(score)) {
            score = 1;
        } else {
            score++;
        }
        this.weightStorage[key] = score;
        writeWeightFile(weightFilePath);
    }

    public static removeWeightKey(key: string): void {
        delete this.weightStorage[key];
        writeWeightFile(weightFilePath);
    }
}
