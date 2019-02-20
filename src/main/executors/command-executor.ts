import { exec } from "child_process";

export function executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        exec(command, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
