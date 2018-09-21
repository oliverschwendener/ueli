import { join } from "path";
import { homedir } from "os";

export class UeliHelpers {
    public static readonly productName = "ueli";
    public static readonly ueliCommandPrefix = "ueli:";
    public static readonly countFilePath = join(homedir(), "ueli.count.json");
    public static readonly shortcutPrefix = "!";
    public static readonly searchResultDescriptionSeparator = "▸";
    public static readonly customCommandDescription = "Custom command";
}
