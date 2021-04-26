import { exec, spawn } from "child_process";

export function executeCommand(command: string): Promise<void> {
    return new Promise((resolve, reject) => {
        executeCommandWithOutput(command)
            .then(() => resolve())
            .catch((err) => reject(err));
    });
}

export function executeCommandWithOutput(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            } else if (stderr) {
                reject(stderr);
            } else {
                resolve(stdout);
            }
        });
    });
}

export function spawnPowershellCommandWithOutput(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        let stdout = "";
        let stderr = "";
        const process = spawn("powershell.exe", ["-NoProfile", "-NonInteractive", "-c", command]);
        process.on("error", (error) => reject(error));
        process.on("exit", (code) => {
            if (code === 0) {
                resolve(stdout);
            } else {
                if (stderr) {
                    reject(`Process exited with code ${code}. stderr: ${stderr}`);
                } else {
                    reject(`Process exited with code ${code}. stdout: ${stdout}`);
                }
            }
        });
        process.stdout.on("data", (chunk: string) => (stdout += chunk));
        process.stderr.on("data", (chunk: string) => (stderr += chunk));
    });
}
