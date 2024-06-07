import type { PowershellUtility } from "@Core/PowershellUtility/Contract";
import type { WindowsControlPanelItem } from "./WindowsControlPanelItem";
import type { WindowsControlPanelItemRepository as WindowsControlPanelItemRepositoryInterface } from "./WindowsControlPanelItemRepositoryInterface";
import { getIconsCommand } from "./powershellScripts";

export class WindowsControlPanelItemRepository implements WindowsControlPanelItemRepositoryInterface {
    public constructor(private readonly powershellUtility: PowershellUtility) {}

    public async retrieveControlPanelItems(
        alreadyKnownItems: WindowsControlPanelItem[],
    ): Promise<WindowsControlPanelItem[]> {
        const controlPanelItemsJson = await this.powershellUtility.executeCommand(
            "[Console]::OutputEncoding = [System.Text.Encoding]::UTF8; Get-ControlPanelItem | ConvertTo-Json",
        );

        const controlPanelItems: WindowsControlPanelItem[] = JSON.parse(controlPanelItemsJson);

        const alreadyKnownItemsStillPresent = alreadyKnownItems.filter((item) =>
            controlPanelItems.some((i) => i.Name === item.Name),
        );
        const newControlPanelItems = controlPanelItems.filter(
            (item) => !alreadyKnownItems.some((i) => i.Name === item.Name),
        );

        if (newControlPanelItems.length === 0) {
            return alreadyKnownItemsStillPresent;
        }

        const controlPanelItemIconsJson = await this.powershellUtility.executeScript(getIconsCommand);

        const controlPanelItemIcons: { applicationName: string; iconBase64: string }[] =
            JSON.parse(controlPanelItemIconsJson);

        for (const icon of controlPanelItemIcons) {
            const item = newControlPanelItems.find((i) => i.CanonicalName === icon.applicationName);

            if (item != null && icon.iconBase64 != null) {
                item.IconBase64 = icon.iconBase64;
            }
        }

        return alreadyKnownItemsStillPresent.concat(newControlPanelItems);
    }
}
