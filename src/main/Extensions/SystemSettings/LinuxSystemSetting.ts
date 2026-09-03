import type { SearchResultItem } from "@Shared/Core";

import type { SystemSetting } from "./SystemSetting";

export class LinuxSystemSetting implements SystemSetting {
    public toSearchResultItem(): SearchResultItem {
        throw new Error("Method not implemented.");
    }
}
