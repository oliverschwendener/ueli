import {
    AppsAddInRegular,
    BugRegular,
    InfoRegular,
    KeyboardMouse16Regular,
    PaintBrushRegular,
    SearchRegular,
    SettingsRegular,
    StarRegular,
    WindowRegular,
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
        absolutePath: "/general",
        element: <General />,
        icon: <SettingsRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsWindow" },
        relativePath: "window",
        absolutePath: "/window",
        element: <Window />,
        icon: <WindowRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsAppearance" },
        relativePath: "appearance",
        absolutePath: "/appearance",
        element: <Appearance />,
        icon: <PaintBrushRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsKeyboardAndMouse" },
        absolutePath: "/keyboard-and-mouse",
        element: <KeyboardAndMouse />,
        relativePath: "keyboard-and-mouse",
        icon: <KeyboardMouse16Regular />,
    },
    {
        translation: { key: "title", namespace: "settingsSearchEngine" },
        relativePath: "search-engine",
        absolutePath: "/search-engine",
        element: <SearchEngine />,
        icon: <SearchRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsFavorites" },
        relativePath: "favorites",
        absolutePath: "/favorites",
        element: <Favorites />,
        icon: <StarRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsExtensions" },
        relativePath: "extensions",
        absolutePath: "/extensions",
        element: <Extensions />,
        icon: <AppsAddInRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsAbout" },
        relativePath: "about",
        absolutePath: "/about",
        element: <About />,
        icon: <InfoRegular />,
    },
    {
        translation: { key: "title", namespace: "settingsDebug" },
        relativePath: "debug",
        absolutePath: "/debug",
        element: <Debug />,
        icon: <BugRegular />,
    },
];
