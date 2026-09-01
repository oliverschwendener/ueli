import type { SearchResultItem } from "@shared/Core";

import type { SystemSetting } from "./SystemSetting";

export class LinuxSystemSetting implements SystemSetting {
    public toSearchResultItem(): SearchResultItem {
        throw new Error("Method not implemented.");
    }
}
