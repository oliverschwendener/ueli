import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { EventEmitter } from "@Core/EventEmitter";
import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { SecondInstanceModule } from "./SecondInstanceModule";

describe(SecondInstanceModule, () => {
    it("should register the event listener and event emitter", () => {
        const createEvent = vi.fn();
        let eventCallback: () => void;
        const app = <App>{
            on: (event: string, callback: () => void) => {
                createEvent(event);
                eventCallback = callback;
            },
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

        SecondInstanceModule.bootstrap(dependencyRegistry);
        expect(createEvent).toBeCalledWith("second-instance");
        // The event shouldn't be emitted on bootstrap
        expect(emitEvent).toHaveBeenCalledTimes(0);
        // Simulate a 'second-instance' event
        eventCallback();
        expect(emitEvent).toHaveBeenCalledOnce();
    });
});
