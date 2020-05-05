import { app } from "electron";
import { mainReloader, rendererReloader } from 'electron-hot-reload';
import * as path from 'path';
import { DevLogger } from "../../common/logger/dev-logger";

const logger = new DevLogger();
export function enableHotReload() {
    const mainFile = path.join(app.getAppPath(), 'bundle', 'main.js');
    const rendererFile = path.join(app.getAppPath(), 'bundle', 'renderer.js');

    mainReloader(mainFile, undefined, () => {
        logger.debug("Reloading Main Process");
    });

    rendererReloader(rendererFile, undefined, () => {
        logger.debug("Reloading Renderer Process");
    });
}