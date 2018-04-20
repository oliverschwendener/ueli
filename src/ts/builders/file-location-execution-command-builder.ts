export class FileLocationExecutionCommandBuilder {
    public static buildWindowsLocationExecutionCommand(filePath: string): string {
        return `start explorer.exe /select,"${filePath}"`;
    }

    public static buildMacOsLocationExecutionCommand(filePath: string): string {
        return `open -R "${filePath}"`;
    }
}
