import {
    Info16Regular,
    PaintBrush16Regular,
    Search16Regular,
    Settings16Regular,
    Window16Regular,
} from "@fluentui/react-icons";
import { ReactElement } from "react";
import { About } from "./About";
import { Appearance } from "./Appearance";
import { General } from "./General";
import { SearchEngine } from "./SearchEngine";
import { Window } from "./Window";

export type SettingsPage = {
    label: string;
    absolutePath: string;
    relativePath: string;
    element: ReactElement;
    icon?: ReactElement;
};

export const settingsPages: SettingsPage[] = [
    {
        label: "General",
        relativePath: "general",
        absolutePath: "/settings/general",
        element: <General />,
        icon: <Settings16Regular />,
    },
    {
        label: "Window",
        relativePath: "window",
        absolutePath: "/settings/window",
        element: <Window />,
        icon: <Window16Regular />,
    },
    {
        label: "Appearance",
        relativePath: "appearance",
        absolutePath: "/settings/appearance",
        element: <Appearance />,
        icon: <PaintBrush16Regular />,
    },
    {
        label: "Search Engine",
        relativePath: "search-engine",
        absolutePath: "/settings/search-engine",
        element: <SearchEngine />,
        icon: <Search16Regular />,
    },
    {
        label: "About",
        relativePath: "about",
        absolutePath: "/settings/about",
        element: <About />,
        icon: <Info16Regular />,
    },
];
