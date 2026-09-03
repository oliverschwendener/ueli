import type { SettingsManager } from "@Core/SettingsManager";
import { getExtensionSettingKey } from "@Shared/Core/Extension";
import type { Workflow } from "@Shared/Extensions/Workflow";

export class WorkflowRepository {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public async getAll(): Promise<Workflow[]> {
        return this.settingsManager.getValue<Workflow[]>(getExtensionSettingKey("Workflow", "workflows"), []);
    }
}
