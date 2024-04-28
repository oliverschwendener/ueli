import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import { Clock } from "./Clock";
import { ClockModule } from "./ClockModule";

describe(ClockModule, () => {
    it("should register the clock", () => {
        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: vi.fn(),
            register: vi.fn(),
        };

        ClockModule.bootstrap(dependencyRegistry);

        expect(dependencyRegistry.register).toHaveBeenCalledWith("Clock", new Clock());
    });
});
