import {
    AppsAddIn20Regular,
    Bug20Regular,
    EyeOffRegular,
    Info20Regular,
    Keyboard20Regular,
    PaintBrush20Regular,
    Search20Regular,
    Settings20Regular,
    Star20Regular,
    Window20Regular,
} from "@fluentui/react-icons";
import type { ReactElement } from "react";
import { About } from "./About";
import { Appearance } from "./Appearance";
import { Debug } from "./Debug";
import { Extensions } from "./Extensions";
import { Favorites } from "./Favorites";
import { General } from "./General";
import { KeyboardAndMouse } from "./KeyboardAndMouse";
import { SearchEngine } from "./SearchEngine";
import { ExcludedItems } from "./SearchEngine/ExcludedItems";
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
        relativePath: "",
        absolutePath: "/",
        element: <General />,
        icon: <Settings20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsWindow" },
        relativePath: "window",
        absolutePath: "/window",
        element: <Window />,
        icon: <Window20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsAppearance" },
        relativePath: "appearance",
        absolutePath: "/appearance",
        element: <Appearance />,
        icon: <PaintBrush20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsKeyboardAndMouse" },
        absolutePath: "/keyboard-and-mouse",
        element: <KeyboardAndMouse />,
        relativePath: "keyboard-and-mouse",
        icon: <Keyboard20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsSearchEngine" },
        relativePath: "search-engine",
        absolutePath: "/search-engine",
        element: <SearchEngine />,
        icon: <Search20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsFavorites" },
        relativePath: "favorites",
        absolutePath: "/favorites",
        element: <Favorites />,
        icon: <Star20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsExcludedItems" },
        relativePath: "excluded-items",
        absolutePath: "/excluded-items",
        element: <ExcludedItems />,
        icon: <EyeOffRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsExtensions" },
        relativePath: "extensions",
        absolutePath: "/extensions",
        element: <Extensions />,
        icon: <AppsAddIn20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsAbout" },
        relativePath: "about",
        absolutePath: "/about",
        element: <About />,
        icon: <Info20Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsDebug" },
        relativePath: "debug",
        absolutePath: "/debug",
        element: <Debug />,
        icon: <Bug20Regular />,
    },
];
