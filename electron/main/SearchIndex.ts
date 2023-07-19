import { RescanSate } from "@common/RescanState";
import { SearchResultItem } from "@common/SearchResultItem";

export class SearchIndex {
    private static readonly SCAN_DURATION_IN_MS = 5000;
    private static readonly RESCAN_INTERVAL_IN_MS = 10000;

    private rescanState: RescanSate;
    private searchResultItems: SearchResultItem[];

    public constructor(
        private readonly onSearchIndexUpdated: () => void,
        private readonly onRescanStateChanged: (rescanState: RescanSate) => void,
    ) {
        this.rescanState = { rescanPending: false };
        this.searchResultItems = [];
    }

    public getSearchResultItems(): SearchResultItem[] {
        return this.searchResultItems;
    }

    public async rescan(): Promise<void> {
        this.changeRescanState({ rescanPending: true });

        await this.wait(SearchIndex.SCAN_DURATION_IN_MS);

        this.searchResultItems = [
            { id: "1", description: "/Applications/Adobe Photoshop.app", name: "Adobe Photoshop" },
            { id: "2", description: "/Applications/Visual Studio Code.app", name: "Visual Studio Code" },
            { id: "3", description: "/Applications/Whatsapp.app", name: "Whatsapp" },
            { id: "4", description: "/Applications/1Password.app", name: "1Password" },
            { id: "5", description: "/Applications/Calculator.app", name: "Calculator" },
            { id: "6", description: "/Applications/Chess.app", name: "Chess" },
            { id: "7", description: "/Applications/ClickUp.app", name: "ClickUp" },
            { id: "8", description: "/Applications/Docker.app", name: "Docker" },
            { id: "9", description: "/Applications/FaceTime.app", name: "FaceTime" },
            { id: "10", description: "/Applications/Fellow.app", name: "Fellow" },
        ];

        this.changeRescanState({ rescanPending: false });

        this.onSearchIndexUpdated();

        setTimeout(() => this.rescan(), SearchIndex.RESCAN_INTERVAL_IN_MS);
    }

    public getRescanState(): RescanSate {
        return this.rescanState;
    }

    private changeRescanState(rescanState: RescanSate): void {
        this.rescanState = rescanState;
        this.onRescanStateChanged(rescanState);
    }

    private wait(millisecondsToWait: number): Promise<void> {
        return new Promise((resolve) => setTimeout(() => resolve(), millisecondsToWait));
    }
}
