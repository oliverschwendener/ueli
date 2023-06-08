import { ReactElement } from "react";
import { General } from "./General";
import { Window } from "./Window";
import { Appearance } from "./Appearance";

export type SettingsPage = {
    label: string;
    absolutePath: string;
    relativePath: string;
    element: ReactElement;
};

export const settingsPages: SettingsPage[] = [
    {
        label: "General",
        relativePath: "general",
        absolutePath: "/settings/general",
        element: <General />,
    },
    {
        label: "Window",
        relativePath: "window",
        absolutePath: "/settings/window",
        element: <Window />,
    },
    {
        label: "Appearance",
        relativePath: "appearance",
        absolutePath: "/settings/appearance",
        element: <Appearance />,
    },
];
