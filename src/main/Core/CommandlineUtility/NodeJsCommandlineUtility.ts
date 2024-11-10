import { exec } from "child_process";
import type { CommandlineUtility } from "./Contract";

export class NodeJsCommandlineUtility implements CommandlineUtility {
    public executeCommand(command: string, options?: { ignoreStdErr?: boolean; ignoreErr?: boolean }): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error && !options?.ignoreErr) {
                    reject(error);
                } else if (stderr && !options?.ignoreStdErr) {
                    reject(stderr);
                } else {
                    resolve(stdout.toString());
                }
            });
        });
    }
}
