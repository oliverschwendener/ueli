import { RescanSate } from "@common/RescanState";
import { SearchResultItem } from "@common/SearchResultItem";

export class SearchIndex {
    private static readonly SCAN_DURATION_IN_MS = 50;
    private static readonly RESCAN_INTERVAL_IN_MS = 360000;

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
            {
                id: "1",
                description: "Application",
                name: "Adobe Photoshop",
                icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Adobe_Photoshop_CS6_icon.svg/1041px-Adobe_Photoshop_CS6_icon.svg.png",
            },
            {
                id: "2",
                description: "Application",
                name: "Visual Studio Code",
                icon: "https://iconape.com/wp-content/png_logo_vector/visual-studio-code.png",
            },
            {
                id: "3",
                description: "Application",
                name: "Whatsapp",
                icon: "https://1.bp.blogspot.com/-zNhb4Jlgjh8/XxFkwihoQ8I/AAAAAAAACS8/tRHsoYUHMXUGbZOPMPIVw48olh6jSqEbwCPcBGAYYCw/s1600/whatsapp-logo-2.png",
            },
            {
                id: "4",
                description: "Application",
                name: "1Password",
                icon: "https://media.idownloadblog.com/wp-content/uploads/2014/10/1Password-5-icon-Mac.png",
            },
            {
                id: "5",
                description: "Application",
                name: "Calculator",
                icon: "https://clipart-library.com/images_k/calculator-transparent/calculator-transparent-17.jpg",
            },
            {
                id: "6",
                description: "Application",
                name: "Chess",
                icon: "https://icons.iconarchive.com/icons/blackvariant/button-ui-system-apps/1024/Chess-icon.png",
            },
            {
                id: "7",
                description: "Application",
                name: "ClickUp",
                icon: "https://d3fu0ec0dkshyt.cloudfront.net/images/clickup/icon.png",
            },
            {
                id: "8",
                description: "Application",
                name: "Docker",
                icon: "https://cdn.icon-icons.com/icons2/2407/PNG/512/docker_icon_146192.png",
            },
            {
                id: "9",
                description: "Application",
                name: "FaceTime",
                icon: "https://purepng.com/public/uploads/large/purepng.com-facetime-iconsymbolsiconsapple-iosiosios-8-iconsios-8-721522596043hhwef.png",
            },
            {
                id: "10",
                description: "Application",
                name: "Fellow",
                icon: "https://cdn-1.webcatalog.io/catalog/fellow-app/fellow-app-icon.png",
            },
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
