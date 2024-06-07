import { useSetting } from "@Core/Hooks";
import type { ContextBridge } from "@common/Core";
import { useState } from "react";

export const useSearchHistoryController = ({ contextBridge }: { contextBridge: ContextBridge }) => {
    const isEnabled = () => contextBridge.getSettingValue("general.searchHistory.enabled", false);

    const { value: searchHistory, updateValue: setSearchHistory } = useSetting<string[]>({
        key: "general.searchHistory.history",
        defaultValue: [],
    });

    const limit = contextBridge.getSettingValue("general.searchHistory.limit", 10);

    const [menuIsOpen, setMenuIsOpen] = useState(false);

    const add = (searchTerm: string) => {
        if (!isEnabled() || searchHistory.includes(searchTerm.trim())) {
            return;
        }

        const updatedHistory = [searchTerm, ...searchHistory];
        updatedHistory.splice(limit, updatedHistory.length - limit);

        setSearchHistory(updatedHistory);
    };

    const closeMenu = () => setMenuIsOpen(false);

    return { add, closeMenu, isEnabled, menuIsOpen, searchHistory, setMenuIsOpen };
};
