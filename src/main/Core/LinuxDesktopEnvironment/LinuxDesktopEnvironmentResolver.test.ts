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
        expect(getMock).toHaveBeenCalledWith("ORIGINAL_XDG_CURRENT_DESKTOP");
    };

    it("should return undefined when XDG_CURRENT_DESKTOP environment variable is not set", () =>
        testResolve({ expected: undefined, xdgCurrentDesktop: "" }));

    it("should return the first valid desktop in XDG_CURRENT_DESKTOP", () =>
        testResolve({ expected: "GNOME", xdgCurrentDesktop: "ubuntu:GNOME:someother:KDE" }));

    it("should return GNOME when XDG_CURRENT_DESKTOP contains GNOME", () =>
        testResolve({ expected: "GNOME", xdgCurrentDesktop: "GNOME" }));

    it("should return GNOME when XDG_CURRENT_DESKTOP contains GNOME-Flashback", () =>
        testResolve({ expected: "GNOME", xdgCurrentDesktop: "GNOME-Flashback" }));

    it("should return GNOME when XDG_CURRENT_DESKTOP contains GNOME-Classic", () =>
        testResolve({ expected: "GNOME", xdgCurrentDesktop: "GNOME-Classic" }));

    it("should return KDE when XDG_CURRENT_DESKTOP contains KDE", () =>
        testResolve({ expected: "KDE", xdgCurrentDesktop: "KDE" }));

    it("should return COSMIC when XDG_CURRENT_DESKTOP contains COSMIC", () =>
        testResolve({ expected: "COSMIC", xdgCurrentDesktop: "COSMIC" }));

    it("should return LXDE when XDG_CURRENT_DESKTOP contains LXDE", () =>
        testResolve({ expected: "LXDE", xdgCurrentDesktop: "LXDE" }));

    it("should return LXQt when XDG_CURRENT_DESKTOP contains LXQt", () =>
        testResolve({ expected: "LXQt", xdgCurrentDesktop: "LXQt" }));

    it("should return MATE when XDG_CURRENT_DESKTOP contains MATE", () =>
        testResolve({ expected: "MATE", xdgCurrentDesktop: "MATE" }));

    it("should return Unity when XDG_CURRENT_DESKTOP contains Unity", () =>
        testResolve({ expected: "Unity", xdgCurrentDesktop: "Unity" }));

    it("should return XFCE when XDG_CURRENT_DESKTOP contains XFCE", () =>
        testResolve({ expected: "XFCE", xdgCurrentDesktop: "XFCE" }));

    it("should return Cinnamon when XDG_CURRENT_DESKTOP contains X-Cinnamon", () =>
        testResolve({ expected: "Cinnamon", xdgCurrentDesktop: "X-Cinnamon" }));

    it("should return Cinnamon when XDG_CURRENT_DESKTOP contains KDE", () =>
        testResolve({ expected: "KDE", xdgCurrentDesktop: "KDE" }));

    it("should return Pantheon when XDG_CURRENT_DESKTOP contains Pantheon", () =>
        testResolve({ expected: "Pantheon", xdgCurrentDesktop: "Pantheon" }));

    it("should return DDE when XDG_CURRENT_DESKTOP contains DDE", () =>
        testResolve({ expected: "DDE", xdgCurrentDesktop: "DDE" }));
});
