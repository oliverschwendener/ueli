export interface OperatingSystemCommand {
    executionArgument: string;
    icon: string;
    name: string;
    needsUserConfirmationBeforeExecution: boolean;
    tags: string[];
}
