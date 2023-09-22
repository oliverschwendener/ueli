import type { ExecutionArgument } from "@common/ExecutionArgument";
import type { CommandlineUtility } from "../../Utilities";
import type { ExecutionService } from "./ExecutionService";

export class PowershellExecutionService implements ExecutionService {
    public constructor(private readonly commandlineUtility: CommandlineUtility) {}

    public execute(executionArgument: ExecutionArgument): Promise<void> {
        return this.commandlineUtility.executeCommand(
            `powershell -Command "& {${executionArgument.searchResultItem.executionServiceArgument}}"`,
        );
    }
}
