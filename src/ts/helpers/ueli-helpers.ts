import { WebUrlExecutor } from "../executors/web-url-executor";

export class UeliHelpers {
    public static readonly ueliCommandPrefix = "ueli:";

    public static openHelp(): void {
        new WebUrlExecutor().execute("https://github.com/oliverschwendener/ueli#ueli");
    }
}
