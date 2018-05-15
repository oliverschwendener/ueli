import { WebUrlExecutor } from "../executors/web-url-executor";
import { join } from "path";
import { homedir } from "os";

export class UeliHelpers {
    public static readonly productName = "ueli";
    public static readonly ueliCommandPrefix = "ueli:";
    public static readonly configFilePath = join(homedir(), "ueli.config.json");
    public static readonly countFilePath = join(process.cwd(), "ueli.count.json");
}
