import { getExtensionSettingKey } from "@common/Core/Extension";
import type { Workflow } from "@common/Extensions/Workflow";
import type { SettingsManager } from "@Core/SettingsManager";

export class WorkflowRepository {
    public constructor(private readonly settingsManager: SettingsManager) {}

    public async getAll(): Promise<Workflow[]> {
        return this.settingsManager.getValue<Workflow[]>(getExtensionSettingKey("Workflow", "workflows"), []);
    }
}
