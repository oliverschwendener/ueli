import { shell } from "electron";
import { platform } from "os";
import { getCurrentOperatingSystem } from "../../common/helpers/operating-system-helpers";
import { OperatingSystem } from "../../common/operating-system";
import { executeCommand } from "./command-executor";

export function openUrlInBrowser(url: string): Promise<void> {
    // openExternal doesn't work on Linux for some reason. Why devs hate us so much??
    if (getCurrentOperatingSystem(platform()) === OperatingSystem.Linux) {
        return executeCommand(`xdg-open ${url}`);
    } else {
        return shell.openExternal(url);
    }
}
