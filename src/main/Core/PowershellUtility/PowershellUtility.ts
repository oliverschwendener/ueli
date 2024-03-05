import { join } from "path";
import type { CommandlineUtility, FileSystemUtility, RandomStringProvider } from "..";
import type { PowershellUtility as PowershellUtilityInterface } from "./Contract";

export class PowershellUtility implements PowershellUtilityInterface {
    public constructor(
        private readonly fileSystemUtility: FileSystemUtility,
        private readonly commandlineUtility: CommandlineUtility,
        private readonly temporaryDirectoryFilePath: string,
        private readonly randomStringProvider: RandomStringProvider,
    ) {}

    public async executeCommand(command: string): Promise<string> {
        return this.commandlineUtility.executeCommand(`powershell -Command "& {${command}}"`);
    }

    public async executeScript(script: string): Promise<string> {
        const filePath = this.getTemporaryPowershellFilePath();

        await this.fileSystemUtility.writeTextFile(script, filePath);

        const powershellCommand = `powershell -NoProfile -NonInteractive -ExecutionPolicy bypass -File "${filePath}"`;
        const stdout = await this.commandlineUtility.executeCommand(powershellCommand);

        await this.fileSystemUtility.removeFile(filePath);

        return stdout;
    }

    private getTemporaryPowershellFilePath(): string {
        return join(this.temporaryDirectoryFilePath, this.getRandomFileName());
    }

    private getRandomFileName(): string {
        return `${this.randomStringProvider.getRandomUUid()}.ps1`;
    }
}
