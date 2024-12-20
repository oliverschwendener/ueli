import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import { describe, expect, it, vi } from "vitest";
import type { EventSubscriber } from "..";
import { BrowserWindowNotifierModule, SearchWindowModule } from "..";
import { BrowserWindowNotifier } from "./BrowserWindowNotifier";

describe(SearchWindowModule, () => {
    describe(SearchWindowModule.bootstrap, () => {
        it("should bootstrap the module", () => {
            const eventSubscriber = <EventSubscriber>{
                subscribe: vi.fn(),
            };

            const dependencies = <Dependencies>{ EventSubscriber: eventSubscriber };

            const dependencyRegistry = <DependencyRegistry<Dependencies>>{
                register: vi.fn(),
                get: (n) => dependencies[n],
            };

            BrowserWindowNotifierModule.bootstrap(dependencyRegistry);

            expect(dependencyRegistry.register).toHaveBeenCalledWith(
                "BrowserWindowNotifier",
                new BrowserWindowNotifier(),
            );

            expect(eventSubscriber.subscribe).toHaveBeenCalledWith("browserWindowCreated", expect.any(Function));
        });
    });
});
