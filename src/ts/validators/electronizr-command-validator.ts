export class ElectronizrCommandValidator {
    public isElectronizrCommand(command: string): boolean {
        return command.startsWith("ezr:");
    }
}