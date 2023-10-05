import {
    Info16Regular,
    PaintBrush16Regular,
    Search16Regular,
    Settings16Regular,
    UsbPlugRegular,
    Window16Regular,
} from "@fluentui/react-icons";
import { ReactElement } from "react";
import { About } from "./About";
import { Appearance } from "./Appearance";
import { General } from "./General";
import { Plugins } from "./Plugins";
import { SearchEngine } from "./SearchEngine";
import { Window } from "./Window";

export type SettingsPage = {
    translationKey: string;
    absolutePath: string;
    relativePath: string;
    element: ReactElement;
    icon?: ReactElement;
};

export const settingsPages: SettingsPage[] = [
    {
        translationKey: "settingsPage.general",
        relativePath: "general",
        absolutePath: "/settings/general",
        element: <General />,
        icon: <Settings16Regular />,
    },
    {
        translationKey: "settingsPage.window",
        relativePath: "window",
        absolutePath: "/settings/window",
        element: <Window />,
        icon: <Window16Regular />,
    },
    {
        translationKey: "settingsPage.appearance",
        relativePath: "appearance",
        absolutePath: "/settings/appearance",
        element: <Appearance />,
        icon: <PaintBrush16Regular />,
    },
    {
        translationKey: "settingsPage.searchEngine",
        relativePath: "search-engine",
        absolutePath: "/settings/search-engine",
        element: <SearchEngine />,
        icon: <Search16Regular />,
    },
    {
        translationKey: "settingsPage.about",
        relativePath: "about",
        absolutePath: "/settings/about",
        element: <About />,
        icon: <Info16Regular />,
    },
    {
        translationKey: "settingsPage.plugins",
        relativePath: "plugins",
        absolutePath: "/settings/plugins",
        element: <Plugins />,
        icon: <UsbPlugRegular />,
    },
];
