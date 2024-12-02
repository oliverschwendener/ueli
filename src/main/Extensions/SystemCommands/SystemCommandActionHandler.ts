import type { ActionHandler } from "@Core/ActionHandler";
import type { SearchResultItemAction } from "@common/Core";
import type { SystemCommandRepository } from "./SystemCommandRepository";

export class SystemCommandActionHandler implements ActionHandler {
    public readonly id = "SystemCommandActionHandler";

    public constructor(private readonly systemCommandRepository: SystemCommandRepository) {}

    public async invokeAction(action: SearchResultItemAction): Promise<void> {
        const id = action.argument;

        const systemCommand = (await this.systemCommandRepository.getAll()).find((s) => s.getId() === id);

        if (!systemCommand) {
            throw new Error(`System command with id "${id}" not found`);
        }

        await systemCommand.invoke();
    }
}
