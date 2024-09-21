import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EventEmitter } from "@Core/EventEmitter";
import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { SingleInstanceLockModule } from "./SingleInstanceLockModule";

describe(SingleInstanceLockModule, () => {
    it("should register the event listener and event emitter", () => {
        const on = vi.fn();
        const app = <App>{
            on: (event: string, callback: () => void) => on(event, callback),
        };

        const emitEvent = vi.fn();
        const eventEmitter = <EventEmitter>{
            emitEvent: (event: string) => emitEvent(event),
        };

        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: (key: keyof Dependencies) => {
                const result = <Dependencies>{
                    App: app,
                    EventEmitter: eventEmitter,
                };

                return result[key];
            },
        };

        SingleInstanceLockModule.bootstrap(dependencyRegistry);
        expect(on).toHaveBeenCalled();
    });
});
