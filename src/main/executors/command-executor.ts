import {promisify} from "util";
const exec = promisify(require("child_process").exec); // tslint:disable-line

export async function executeCommand(command: string): Promise<void> {
    try {
        const {stderr} = await exec(command);
        if (stderr) {
            return stderr;
        }
    } catch (error) {
        return error;
    }
}
