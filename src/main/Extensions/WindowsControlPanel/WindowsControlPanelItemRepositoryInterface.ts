import type { WindowsControlPanelItem } from "./WindowsControlPanelItem";

export interface WindowsControlPanelItemRepository {
    retrieveControlPanelItems(alreadyKnownItems: WindowsControlPanelItem[]): Promise<WindowsControlPanelItem[]>;
}
