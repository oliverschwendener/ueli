import { BrowserHistory } from "./browser-history";
import { Browser } from "./browser";
import { Icon } from "../../../common/icon/icon";

export interface BrowserHistoryRepository {
    browser: Browser;
    defaultIcon: Icon;
    getBrowserHistories(): Promise<BrowserHistory[]>;
}
