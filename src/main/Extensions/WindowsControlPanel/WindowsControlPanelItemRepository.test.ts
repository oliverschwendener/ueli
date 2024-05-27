import type { PowershellUtility } from "@Core/PowershellUtility/Contract";
import { describe, expect, it, vi } from "vitest";
import { WindowsControlPanelItemRepository } from "./WindowsControlPanelItemRepository";

describe(WindowsControlPanelItemRepository, () => {
    describe(WindowsControlPanelItemRepository.prototype.retrieveControlPanelItems, () => {
        it("should retrieve items and icons", async () => {
            const mockedItems = JSON.stringify([
                {
                    Name: "name 1",
                    CanonicalName: "canonical name 1",
                    Description: "description 1",
                },
                {
                    Name: "name 2",
                    CanonicalName: "canonical name 2",
                    Description: "description 2",
                },
            ]);
            const mockedAppIcons = JSON.stringify([
                {
                    applicationName: "canonical name 1",
                    iconBase64: "icon 1",
                },
                {
                    applicationName: "canonical name 2",
                    iconBase64: "icon 2",
                },
            ]);
            const powershellUtility = <PowershellUtility>{
                executeCommand: vi.fn().mockResolvedValue(mockedItems),
                executeScript: vi.fn().mockResolvedValue(mockedAppIcons),
            };
            const repository = new WindowsControlPanelItemRepository(powershellUtility);

            const items = await repository.retrieveControlPanelItems([]);

            expect(items).toEqual([
                {
                    Name: "name 1",
                    CanonicalName: "canonical name 1",
                    Description: "description 1",
                    IconBase64: "icon 1",
                },
                {
                    Name: "name 2",
                    CanonicalName: "canonical name 2",
                    Description: "description 2",
                    IconBase64: "icon 2",
                },
            ]);
        });

        it("should not retrieve icons if they are already known", async () => {
            const mockedItems = JSON.stringify([
                {
                    Name: "name 1",
                    CanonicalName: "canonical name 1",
                    Description: "description 1",
                },
                {
                    Name: "name 2",
                    CanonicalName: "canonical name 2",
                    Description: "description 2",
                },
            ]);
            const powershellUtility = <PowershellUtility>{
                executeCommand: vi.fn().mockResolvedValue(mockedItems),
                executeScript: vi.fn().mockResolvedValue(""),
            };
            const repository = new WindowsControlPanelItemRepository(powershellUtility);
            const knownItems = [
                {
                    Name: "name 1",
                    CanonicalName: "canonical name 1",
                    Description: "description 1",
                    IconBase64: "icon 1",
                },
                {
                    Name: "name 2",
                    CanonicalName: "canonical name 2",
                    Description: "description 2",
                    IconBase64: "icon 2",
                },
            ];

            const items = await repository.retrieveControlPanelItems(knownItems);

            expect(items).toEqual([
                {
                    Name: "name 1",
                    CanonicalName: "canonical name 1",
                    Description: "description 1",
                    IconBase64: "icon 1",
                },
                {
                    Name: "name 2",
                    CanonicalName: "canonical name 2",
                    Description: "description 2",
                    IconBase64: "icon 2",
                },
            ]);
            expect(powershellUtility.executeScript).not.toHaveBeenCalled();
        });
    });
});
