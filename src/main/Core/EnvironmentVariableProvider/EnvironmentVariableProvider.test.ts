import { describe, expect, it } from "vitest";
import { EnvironmentVariableProvider } from "./EnvironmentVariableProvider";

describe(EnvironmentVariableProvider, () => {
    it("should return all environment variables", () => {
        const environmentVariables = {
            foo: "bar",
            bar: "baz",
        };

        expect(new EnvironmentVariableProvider(environmentVariables).getAll()).toBe(environmentVariables);
    });

    it("should return the value of a specific environment variable", () => {
        const environmentVariables = {
            foo: "bar",
            bar: "baz",
        };

        expect(new EnvironmentVariableProvider(environmentVariables).get("foo")).toBe("bar");
    });

    it("should return undefined if the environment variable does not exist", () => {
        const environmentVariables = {
            foo: "bar",
            bar: "baz",
        };

        expect(new EnvironmentVariableProvider(environmentVariables).get("baz")).toBeUndefined();
    });
});
