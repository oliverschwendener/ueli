import { exec } from "child_process";
import type { CommandlineUtility } from "./Contract";

export class NodeJsCommandlineUtility implements CommandlineUtility {
    public executeCommand(command: string, ignoreStdErr?: boolean, ignoreErr?: boolean): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error && !ignoreErr) {
                    reject(error);
                } else if (stderr && !ignoreStdErr) {
                    reject(stderr);
                } else {
                    resolve(stdout.toString());
                }
            });
        });
    }
}
