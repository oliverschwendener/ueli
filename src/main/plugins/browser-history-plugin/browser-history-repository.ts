import { BrowserHistoryEntry } from "./browser-history-entry";
import { Browser } from "./browser";
import { Icon } from "../../../common/icon/icon";

export interface BrowserHistoryRepository {
    browser: Browser;
    defaultIcon: Icon;
    getBrowserHistory(): Promise<BrowserHistoryEntry[]>;
}
