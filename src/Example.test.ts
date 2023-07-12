import { describe, it, expect } from "vitest";
import { Calculator } from "./Example";

describe(Calculator, () => {
    it("should add two numbers", () => expect(Calculator.add(1, 2)).toBe(3));
});
