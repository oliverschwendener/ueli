export class FileExecutionCommandBuilder {
    public static buildWindowsFileExecutionCommand(filePath: string): string {
        return `start explorer "${filePath}"`;
    }

    public static buildMacOsFileExecutionCommand(filePath: string): string {
        return `open "${filePath}"`;
    }
}
