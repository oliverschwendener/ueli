import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { DuckDuckGoWebSearchEngine } from "./DuckDuckGoWebSearchEngine";
import { GoogleWebSearchEngine } from "./GoogleWebSearchEngine";
import { WebSearchExtension } from "./WebSearchExtension";
import { WebSearchExtensionModule } from "./WebSearchExtensionModule";

describe(WebSearchExtensionModule, () => {
    describe(WebSearchExtensionModule.prototype.bootstrap, () => {
        it("should return the web search extension", () => {
            const dependencyRegistry: DependencyRegistry<Dependencies> = {
                get: vi.fn(),
                register: vi.fn(),
            };

            expect(new WebSearchExtensionModule().bootstrap(dependencyRegistry)).toEqual({
                extension: new WebSearchExtension(
                    dependencyRegistry.get("AssetPathResolver"),
                    dependencyRegistry.get("SettingsManager"),
                    [
                        new DuckDuckGoWebSearchEngine(dependencyRegistry.get("Net")),
                        new GoogleWebSearchEngine(dependencyRegistry.get("Net")),
                    ],
                ),
            });
        });
    });
});
