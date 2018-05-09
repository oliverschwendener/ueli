import { WebUrlExecutor } from "../executors/web-url-executor";

export class UeliHelpers {
    public static openHelp(): void {
        new WebUrlExecutor().execute("https://github.com/oliverschwendener/ueli#ueli");
    }
}
