import { describe, expect, it } from "vitest";
import { DependencyRegistry } from "./DependencyRegistry";

describe(DependencyRegistry, () => {
    it("should be able to register a dependency and get it afterwards", () => {
        const dependencyRegistry = new DependencyRegistry<{
            a?: string;
            b?: number;
            c?: undefined;
            d?: null;
            e?: string;
        }>({});

        dependencyRegistry.register("a", "this is a string");
        dependencyRegistry.register("b", 1138);
        dependencyRegistry.register("c", undefined);
        dependencyRegistry.register("d", null);
        dependencyRegistry.register("e", "");

        expect(dependencyRegistry.get("a")).toBe("this is a string");
        expect(dependencyRegistry.get("b")).toBe(1138);
        expect(dependencyRegistry.get("c")).toBe(undefined);
        expect(dependencyRegistry.get("d")).toBe(null);
        expect(dependencyRegistry.get("e")).toBe("");
    });

    it("should should throw an error when trying to register the same dependency twice", () => {
        const dependencyRegistry = new DependencyRegistry<{ a?: string }>({});

        expect(() => {
            dependencyRegistry.register("a", "this is a string");
            dependencyRegistry.register("a", "this is a string");
        }).toThrowError(`Dependency "a" is already registered`);
    });

    it("should throw an error if dependency is not found", () => {
        const dependencyRegistry = new DependencyRegistry<{ a?: string }>({});

        expect(() => dependencyRegistry.get("a")).toThrow(`Dependency with name "a" could not be found`);
    });
});
