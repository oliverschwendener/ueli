import {
    AppsAddIn16Regular,
    Bug16Regular,
    Info16Regular,
    PaintBrush16Regular,
    Search16Regular,
    Settings16Regular,
    StarRegular,
    Window16Regular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";
import { About } from "./About";
import { Appearance } from "./Appearance";
import { Debug } from "./Debug";
import { Extensions } from "./Extensions";
import { Favorites } from "./Favorites";
import { General } from "./General";
import { SearchEngine } from "./SearchEngine";
import { Window } from "./Window";

export type SettingsPage = {
    translation: { key: string; namespace: string };
    absolutePath: string;
    relativePath: string;
    element: ReactElement;
    icon?: ReactElement;
};

export const settingsPages: SettingsPage[] = [
    {
        translation: { key: "title", namespace: "settingsGeneral" },
        relativePath: "general",
        absolutePath: "/settings/general",
        element: <General />,
        icon: <Settings16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsWindow" },
        relativePath: "window",
        absolutePath: "/settings/window",
        element: <Window />,
        icon: <Window16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsAppearance" },
        relativePath: "appearance",
        absolutePath: "/settings/appearance",
        element: <Appearance />,
        icon: <PaintBrush16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsSearchEngine" },
        relativePath: "search-engine",
        absolutePath: "/settings/search-engine",
        element: <SearchEngine />,
        icon: <Search16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsFavorites" },
        relativePath: "favorites",
        absolutePath: "/settings/favorites",
        element: <Favorites />,
        icon: <StarRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsExtensions" },
        relativePath: "extensions",
        absolutePath: "/settings/extensions",
        element: <Extensions />,
        icon: <AppsAddIn16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsAbout" },
        relativePath: "about",
        absolutePath: "/settings/about",
        element: <About />,
        icon: <Info16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsDebug" },
        relativePath: "debug",
        absolutePath: "/settings/debug",
        element: <Debug />,
        icon: <Bug16Regular />,
    },
];
