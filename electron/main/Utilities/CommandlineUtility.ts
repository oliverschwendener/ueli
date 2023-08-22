import { exec } from "child_process";

export class CommandlineUtility {
    public static executeCommandWithOutput(command: string): Promise<string> {
        return new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else if (stderr) {
                    reject(stderr);
                } else {
                    resolve(stdout.toString());
                }
            });
        });
    }

    public static async executeCommand(command: string): Promise<void> {
        await this.executeCommandWithOutput(command);
    }
}
