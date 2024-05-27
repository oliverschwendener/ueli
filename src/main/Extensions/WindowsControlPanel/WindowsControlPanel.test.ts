import type { AssetPathResolver } from "@Core/AssetPathResolver/AssetPathResolver";
import type { Translator } from "@Core/Translator";
import type { SearchResultItem } from "@common/Core";
import { describe, expect, it, vi } from "vitest";
import { WindowsControlPanel } from "./WindowsControlPanel";
import type { WindowsControlPanelItem } from "./WindowsControlPanelItem";
import type { WindowsControlPanelItemRepository } from "./WindowsControlPanelItemRepositoryInterface";

describe(WindowsControlPanel, () => {
    describe(WindowsControlPanel.prototype.isSupported, () => {
        it("should only be supported on Windows", () => {
            const translator = <Translator>{};
            const assetPathResolver = <AssetPathResolver>{};
            const repo = <WindowsControlPanelItemRepository>{};

            expect(new WindowsControlPanel("Windows", translator, assetPathResolver, repo).isSupported()).toBe(true);
            expect(new WindowsControlPanel("Linux", translator, assetPathResolver, repo).isSupported()).toBe(false);
            expect(new WindowsControlPanel("macOS", translator, assetPathResolver, repo).isSupported()).toBe(false);
        });
    });

    describe(WindowsControlPanel.prototype.getSearchResultItems, () => {
        it("retrieves items from repository passing known items and converts them to search result items", async () => {
            const t = (key: string) => `translation[${key}]`;
            const createTMock = vi.fn().mockReturnValue({ t });
            const translator = <Translator>{ createT: createTMock };
            const assetPathResolver = <AssetPathResolver>{};

            const windowsControlPanelItemRepository = <WindowsControlPanelItemRepository>{
                retrieveControlPanelItems: vi.fn().mockResolvedValue(<WindowsControlPanelItem[]>[
                    {
                        Name: "item 1 name",
                        CanonicalName: "item 1 canonical name",
                        IconBase64: "item 1 icon",
                    },
                    {
                        Name: "item 2 name",
                        CanonicalName: "item 2 canonical name",
                        IconBase64: "item 2 icon",
                    },
                ]),
            };

            const extension = new WindowsControlPanel(
                "Windows",
                translator,
                assetPathResolver,
                windowsControlPanelItemRepository,
            );

            extension["knownControlPanelItems"] = [
                {
                    Name: "item 1 name",
                    CanonicalName: "item 1 canonical name",
                    IconBase64: "item 1 icon",
                },
            ];

            const items = await extension.getSearchResultItems();

            expect(items).toEqual(<SearchResultItem[]>[
                {
                    id: "item 1 canonical name",
                    name: "item 1 name",
                    description: t("searchResultItemDescription"),
                    image: { url: `data:image/png;base64,item 1 icon` },
                    defaultAction: {
                        argument: "item 1 name",
                        description: "translation[openItem]",
                        fluentIcon: "OpenRegular",
                        handlerId: "WindowsControlPanel",
                    },
                },
                {
                    id: "item 2 canonical name",
                    name: "item 2 name",
                    description: t("searchResultItemDescription"),
                    image: { url: `data:image/png;base64,item 2 icon` },
                    defaultAction: {
                        argument: "item 2 name",
                        description: "translation[openItem]",
                        fluentIcon: "OpenRegular",
                        handlerId: "WindowsControlPanel",
                    },
                },
            ]);

            expect(windowsControlPanelItemRepository.retrieveControlPanelItems).toHaveBeenCalledWith(<
                WindowsControlPanelItem[]
            >[
                {
                    Name: "item 1 name",
                    CanonicalName: "item 1 canonical name",
                    IconBase64: "item 1 icon",
                },
            ]);
        });
    });
});
