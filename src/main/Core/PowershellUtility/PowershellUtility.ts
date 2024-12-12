import type { CommandlineUtility } from "@Core/CommandlineUtility";
import type { FileSystemUtility } from "@Core/FileSystemUtility";
import type { RandomStringProvider } from "@Core/RandomStringProvider";
import { join } from "path";
import type { PowershellUtility as PowershellUtilityInterface } from "./Contract";

export class PowershellUtility implements PowershellUtilityInterface {
    public static PowershellPath = `C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe`;

    private readonly byteOrderMark: string = "\ufeff";

    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly temporaryDirectoryFilePath: string,
        private readonly randomStringProvider: RandomStringProvider,
    ) {}

    public async executeCommand(command: string, options?: { maxBuffer: number }): Promise<string> {
        return await this.commandlineUtility.executeCommand(
            `${PowershellUtility.PowershellPath} -Command "& {${command}}"`,
            options,
        );
    }

    public async executeScript(script: string, options?: { maxBuffer: number }): Promise<string> {
        const filePath = join(this.temporaryDirectoryFilePath, `${this.randomStringProvider.getRandomUUid()}.ps1`);

        await this.fileSystemUtility.writeTextFile(`${this.byteOrderMark}${script}`, filePath);

        const stdout = await this.commandlineUtility.executeCommand(
            `${PowershellUtility.PowershellPath} -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${filePath}"`,
            options,
        );

        await this.fileSystemUtility.removeFile(filePath);

        return stdout;
    }
}
