import { describe, expect, it } from "vitest";
import { ModuleRegistry } from "./ModuleRegistry";

describe(ModuleRegistry, () => {
    it("should be able to register a module and get it afterwards", () => {
        const moduleRegistry = new ModuleRegistry<{
            a?: string;
            b?: number;
            c?: undefined;
            d?: null;
            e?: string;
        }>({});

        moduleRegistry.register("a", "this is a string");
        moduleRegistry.register("b", 1138);
        moduleRegistry.register("c", undefined);
        moduleRegistry.register("d", null);
        moduleRegistry.register("e", "");

        expect(moduleRegistry.get("a")).toBe("this is a string");
        expect(moduleRegistry.get("b")).toBe(1138);
        expect(moduleRegistry.get("c")).toBe(undefined);
        expect(moduleRegistry.get("d")).toBe(null);
        expect(moduleRegistry.get("e")).toBe("");
    });

    it("should should throw an error when trying to register the same modules twice", () => {
        const moduleRegistry = new ModuleRegistry<{ a?: string }>({});

        expect(() => {
            moduleRegistry.register("a", "this is a string");
            moduleRegistry.register("a", "this is a string");
        }).toThrowError(`Module "a" is already registered`);
    });

    it("should throw an error if module is not found", () => {
        const moduleRegistry = new ModuleRegistry<{ a?: string }>({});

        expect(() => moduleRegistry.get("a")).toThrow(`Module with name "a" could not be found`);
    });
});
