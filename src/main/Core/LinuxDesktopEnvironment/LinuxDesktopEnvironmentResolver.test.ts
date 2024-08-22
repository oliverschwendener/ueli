import type { EnvironmentVariableProvider } from "@Core/EnvironmentVariableProvider";
import { describe, expect, it, vi } from "vitest";
import type { LinuxDesktopEnvironment } from "./Contract";
import { LinuxDesktopEnvironmentResolver } from "./LinuxDesktopEnvironmentResolver";

describe(LinuxDesktopEnvironmentResolver, () => {
    const testResolve = ({
        expected,
        xdgCurrentDesktop,
    }: {
        expected?: LinuxDesktopEnvironment;
        xdgCurrentDesktop: string;
    }) => {
        const getMock = vi.fn().mockReturnValue(xdgCurrentDesktop);
        const environmentVariableProvider = <EnvironmentVariableProvider>{ get: (n) => getMock(n) };

        expect(new LinuxDesktopEnvironmentResolver(environmentVariableProvider).resolve()).toBe(expected);
        expect(getMock).toHaveBeenCalledOnce();
        expect(getMock).toHaveBeenCalledWith("XDG_CURRENT_DESKTOP");
    };

    it("should return undefined when XDG_CURRENT_DESKTOP environment variable is not set", () =>
        testResolve({ expected: undefined, xdgCurrentDesktop: "" }));

    it("should return GNOME when XDG_CURRENT_DESKTOP is ubuntu:GNOME", () =>
        testResolve({ expected: "GNOME", xdgCurrentDesktop: "ubuntu:GNOME" }));

    it("should return KDE when XDG_CURRENT_DESKTOP is KDE", () =>
        testResolve({ expected: "KDE", xdgCurrentDesktop: "KDE" }));
});
