import { WindowsControlPanelItem } from "../WindowsControlPanelItem";

export interface WindowsControlPanelItemsRepository {
    retrieveControlPanelItems(alreadyKnownItems: WindowsControlPanelItem[]): Promise<WindowsControlPanelItem[]>;
}
