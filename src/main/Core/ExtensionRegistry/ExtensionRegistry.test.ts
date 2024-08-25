import type { Extension } from "@Core/Extension";
import { describe, expect, it } from "vitest";
import { ExtensionRegistry } from "./ExtensionRegistry";

describe(ExtensionRegistry, () => {
    it("should be able to register an extension and get it afterwards", () => {
        const extensionRegistry = new ExtensionRegistry();

        const extension = <Extension>{ id: "extension1" };

        extensionRegistry.register(extension);

        expect(extensionRegistry.getById(extension.id)).toBe(extension);
        expect(extensionRegistry.getAll()).toEqual([extension]);
    });

    it("should throw when trying to register the same extension twice", () => {
        const extensionRegistry = new ExtensionRegistry();
        const extension = <Extension>{ id: "extension1" };

        expect(() => {
            extensionRegistry.register(extension);
            extensionRegistry.register(extension);
        }).toThrowError(`Extension with id "${extension.id}" is already registered`);
    });

    it("should throw when trying to get an extension that can't be found", () => {
        expect(() => new ExtensionRegistry().getById("extension1")).toThrowError(
            `Unable to find extension with id "extension1"`,
        );
    });
});
