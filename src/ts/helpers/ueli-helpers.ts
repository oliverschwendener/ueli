import { join } from "path";
import { homedir } from "os";

export class UeliHelpers {
    public static readonly productName = "ueli";
    public static readonly ueliCommandPrefix = "ueli:";
    public static readonly configFilePath = join(homedir(), "ueli.config.json");
    public static readonly countFilePath = join(homedir(), "ueli.count.json");
    public static readonly customCommandPrefix = "!";
}
