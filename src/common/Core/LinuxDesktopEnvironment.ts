/**
 * All supported Linux desktop environments.
 */
export const SupportedLinuxDesktopEnvironments = [
    "GNOME",
    "GNOME-Classic",
    "GNOME-Flashback",
    "KDE",
    "LXDE",
    "LXQt",
    "MATE",
    "XFCE",
    "Cinnamon",
    "X-Cinnamon",
    "Pantheon",
] as const;

export type LinuxDesktopEnvironment = (typeof SupportedLinuxDesktopEnvironments)[number];
