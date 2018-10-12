import { join } from "path";
// import { homedir } from "os";
import { cwd } from "process";

export class UeliHelpers {
    public static readonly productName = "ueli";
    public static readonly ueliCommandPrefix = "ueli:";
    public static readonly countFilePath = join(cwd(), "ueli.count.json");
    public static readonly shortcutPrefix = "!";
    public static readonly searchResultDescriptionSeparator = "▸";
    public static readonly customCommandDescription = "Custom command";
}
