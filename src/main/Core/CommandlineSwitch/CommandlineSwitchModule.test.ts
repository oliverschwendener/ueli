import type { UeliModuleRegistry, UeliModules } from "@Core/ModuleRegistry";
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

        const moduleRegistry = <UeliModuleRegistry>{
            get: (key: keyof UeliModules) => {
                const result = <UeliModules>{
                    App: app,
                    OperatingSystem: operatingSystem,
                };

                return result[key];
            },
        };

        CommandlineSwitchModule.bootstrap(moduleRegistry);

        if (expectAppendingSwitch) {
            expect(appendSwitchMock).toHaveBeenCalledWith("wm-window-animations-disabled");
        } else {
            expect(appendSwitchMock).not.toHaveBeenCalledWith("wm-window-animations-disabled");
        }
    };

    it("should append the commandline switch to disable animations only on Windows", () => {
        testDisableAnimationsOnWindows({ operatingSystem: "Windows", expectAppendingSwitch: true });
        testDisableAnimationsOnWindows({ operatingSystem: "macOS", expectAppendingSwitch: false });
        testDisableAnimationsOnWindows({ operatingSystem: "Linux", expectAppendingSwitch: false });
    });
});
