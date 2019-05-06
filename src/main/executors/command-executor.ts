import { exec } from "child_process";

export function executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve();
            }
        });
    });
}
