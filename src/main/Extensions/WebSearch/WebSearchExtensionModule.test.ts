import type { UeliModuleRegistry } from "@Core/ModuleRegistry";
import { describe, expect, it, vi } from "vitest";
import { DuckDuckGoWebSearchEngine } from "./DuckDuckGoWebSearchEngine";
import { GoogleWebSearchEngine } from "./GoogleWebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";
import { WebSearchExtensionModule } from "./WebSearchExtensionModule";

describe(WebSearchExtensionModule, () => {
    describe(WebSearchExtensionModule.prototype.bootstrap, () => {
        it("should return the web search extension", () => {
            const moduleRegistry: UeliModuleRegistry = {
                get: vi.fn(),
                register: vi.fn(),
            };

            expect(new WebSearchExtensionModule().bootstrap(moduleRegistry)).toEqual({
                extension: new WebSearchExtension(
                    moduleRegistry.get("AssetPathResolver"),
                    moduleRegistry.get("SettingsManager"),
                    [
                        new DuckDuckGoWebSearchEngine(moduleRegistry.get("Net")),
                        new GoogleWebSearchEngine(moduleRegistry.get("Net")),
                    ],
                ),
            });
        });
    });
});
