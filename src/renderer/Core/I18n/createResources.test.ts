import { describe, expect, it } from "vitest";
import { createResources } from "./createResources";

describe(createResources, () => {
    it("should create resources from namespaced translations", () => {
        expect(
            createResources([
                {
                    namespace: "general",
                    resources: { "en-US": { label: "Hello" }, "de-CH": { label: "Hallo" } },
                },
                {
                    namespace: "search",
                    resources: { "en-US": { label: "Search" }, "fr-FR": { label: "Recherche" } },
                },
            ]),
        ).toEqual({
            "en-US": { general: { label: "Hello" }, search: { label: "Search" } },
            "de-CH": { general: { label: "Hallo" } },
            "fr-FR": { search: { label: "Recherche" } },
        });
    });
});
