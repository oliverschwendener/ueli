import type { Dependencies } from "@Core/Dependencies";
import type { DependencyRegistry } from "@Core/DependencyRegistry";
import type { OperatingSystem } from "@common/Core";
import type { App } from "electron";
import { describe, expect, it, vi } from "vitest";
import { CommandlineSwitchModule } from "./CommandlineSwitchModule";

describe(CommandlineSwitchModule, () => {
    const testDisableAnimationsOnWindows = ({
        operatingSystem,
        expectAppendingSwitch,
    }: {
        operatingSystem: OperatingSystem;
        expectAppendingSwitch: boolean;
    }) => {
        const appendSwitchMock = vi.fn();
        const app = <App>{ commandLine: { appendSwitch: (s) => appendSwitchMock(s) } };

        const dependencyRegistry = <DependencyRegistry<Dependencies>>{
            get: (key: keyof Dependencies) => {
                const result = <Dependencies>{
                    App: app,
                    OperatingSystem: operatingSystem,
                };

                return result[key];
            },
        };

        CommandlineSwitchModule.bootstrap(dependencyRegistry);

        expectAppendingSwitch
            ? expect(appendSwitchMock).toHaveBeenCalledWith("wm-window-animations-disabled")
            : expect(appendSwitchMock).not.toHaveBeenCalledWith("wm-window-animations-disabled");
    };

    it("should append the commandline switch to disable animations only on Windows", () => {
        testDisableAnimationsOnWindows({ operatingSystem: "Windows", expectAppendingSwitch: true });
        testDisableAnimationsOnWindows({ operatingSystem: "macOS", expectAppendingSwitch: false });
        testDisableAnimationsOnWindows({ operatingSystem: "Linux", expectAppendingSwitch: false });
    });
});
