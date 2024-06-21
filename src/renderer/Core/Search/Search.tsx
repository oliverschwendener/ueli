import { KeyboardShortcut } from "@Core/Components";
import { ThemeContext } from "@Core/ThemeContext";
import type { SearchResultItem } from "@common/Core";
import { Button, Text } from "@fluentui/react-components";
import { SettingsRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { BaseLayout } from "../BaseLayout";
import { Footer } from "../Footer";
import { useContextBridge } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
import { SearchBar } from "./SearchBar";
import { SearchBarAppearance } from "./SearchBarAppearance";
import { SearchBarSize } from "./SearchBarSize";
import { SearchHistory } from "./SearchHistory";
import { useSearchHistoryController } from "./SearchHistoryController";
import { SearchResultList } from "./SearchResultList";
import { useSearchViewController } from "./SearchViewController";

type SearchProps = {
    searchResultItems: SearchResultItem[];
    excludedSearchResultItemIds: string[];
    favoriteSearchResultItemIds: string[];
};

export const Search = ({
    searchResultItems,
    excludedSearchResultItemIds,
    favoriteSearchResultItemIds,
}: SearchProps) => {
    const { t } = useTranslation("search");
    const { contextBridge } = useContextBridge();
    const { theme } = useContext(ThemeContext);

    const [additionalActionsMenuIsOpen, setAdditionalActionsMenuIsOpen] = useState(false);

    const {
        searchResult,
        searchTerm,
        selectedItemId,
        search,
        userInput,
        confirmationDialog,
        invokeAction,
        invokeSelectedSearchResultItem,
    } = useSearchViewController({
        contextBridge,
        searchResultItems,
        excludedSearchResultItemIds,
        favoriteSearchResultItemIds,
    });

    const searchHistory = useSearchHistoryController({ contextBridge });
    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });

    const singleClickBehavior = contextBridge.getSettingValue(
        "keyboardAndMouse.singleClickBehavior",
        "selectSearchResultItem",
    );

    const doubleClickBehavior = contextBridge.getSettingValue(
        "keyboardAndMouse.doubleClickBehavior",
        "invokeSearchResultItem",
    );

    const handleUserInputKeyDownEvent = (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => {
        const eventHandlers: KeyboardEventHandler[] = [
            {
                listener: () => contextBridge.ipcRenderer.send("escapePressed"),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "Escape",
            },
            {
                listener: () => selectedItemId.previous(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowUp",
            },
            {
                listener: () => selectedItemId.next(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowDown",
            },
            {
                listener: async () => {
                    searchHistory.add(searchTerm.value);
                    await invokeSelectedSearchResultItem();
                },
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "Enter",
            },
        ];

        for (const eventHandler of eventHandlers) {
            if (eventHandler.needsToInvokeListener(keyboardEvent)) {
                keyboardEvent.preventDefault();
                eventHandler.listener();
            }
        }
    };

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) => selectedItemId.set(s.id),
        invokeSearchResultItem: (s) => {
            searchHistory.add(searchTerm.value);
            invokeAction(s.defaultAction);
        },
    };

    const handleSearchResultItemClickEvent = (searchResultItem: SearchResultItem) => {
        clickHandlers[singleClickBehavior](searchResultItem);
    };

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) => {
        clickHandlers[doubleClickBehavior](searchResultItem);
    };

    const closeConfirmationDialog = () => {
        confirmationDialog.action.reset();
        userInput.focus();
    };

    const toggleAdditionalActionsMenu = (open: boolean) => {
        setAdditionalActionsMenuIsOpen(open);

        if (!open) {
            userInput.focus();
            userInput.select();
        }
    };

    useEffect(() => {
        const setFocusOnUserInputAndSelectText = () => {
            userInput.focus();
            userInput.select();
        };

        setFocusOnUserInputAndSelectText();

        searchHistory.closeMenu();

        const windowFocusedEventHandler = () => {
            setFocusOnUserInputAndSelectText();
            searchHistory.closeMenu();
            setAdditionalActionsMenuIsOpen(false);
        };

        const keyDownEventHandler = (event: KeyboardEvent) => {
            const handlers = [
                {
                    validator: () =>
                        contextBridge.getOperatingSystem() === "macOS"
                            ? event.key === "," && event.metaKey
                            : event.key === "," && event.ctrlKey,
                    action: () => {
                        event.preventDefault();
                        openSettings();
                    },
                },
                {
                    validator: () =>
                        contextBridge.getOperatingSystem() === "macOS"
                            ? event.key === "k" && event.metaKey
                            : event.key === "k" && event.ctrlKey,
                    action: () => {
                        event.preventDefault();
                        additionalActionsButtonRef.current?.click();
                    },
                },
            ];

            for (const handler of handlers) {
                if (handler.validator()) {
                    handler.action();
                }
            }
        };

        contextBridge.ipcRenderer.on("windowFocused", windowFocusedEventHandler);
        window.addEventListener("keydown", keyDownEventHandler);

        return () => {
            contextBridge.ipcRenderer.off("windowFocused", windowFocusedEventHandler);
            window.removeEventListener("keydown", keyDownEventHandler);
        };
    }, []);

    useEffect(() => {
        searchHistory.closeMenu();
        search(searchTerm.value, selectedItemId.value);
    }, [searchResultItems]);

    useEffect(() => {
        searchHistory.closeMenu();
        search(searchTerm.value);
    }, [favoriteSearchResultItemIds, excludedSearchResultItemIds]);

    return (
        <BaseLayout
            header={
                <div
                    className="draggable-area"
                    style={{
                        boxSizing: "border-box",
                        display: "flex",
                        flexDirection: "column",
                        flexShrink: 0,
                        padding: 10,
                    }}
                >
                    <SearchBar
                        refObject={userInput.ref}
                        onKeyDown={handleUserInputKeyDownEvent}
                        onSearchTermUpdated={search}
                        searchTerm={searchTerm.value}
                        searchBarSize={contextBridge.getSettingValue<SearchBarSize>(
                            "appearance.searchBarSize",
                            "large",
                        )}
                        searchBarAppearance={contextBridge.getSettingValue<SearchBarAppearance>(
                            "appearance.searchBarAppearance",
                            "auto",
                        )}
                        searchBarPlaceholderText={contextBridge.getSettingValue(
                            "appearance.searchBarPlaceholderText",
                            t("searchBarPlaceholderText"),
                        )}
                        showIcon={contextBridge.getSettingValue("appearance.showSearchIcon", true)}
                        contentAfter={
                            searchHistory.isEnabled() ? (
                                <SearchHistory
                                    {...searchHistory}
                                    onItemSelected={search}
                                    onMenuClosed={() => {
                                        userInput.focus();
                                        userInput.select();
                                    }}
                                />
                            ) : undefined
                        }
                    />
                </div>
            }
            contentRef={containerRef}
            content={
                contextBridge.getScanCount() === 0 ? (
                    <ScanIndicator />
                ) : (
                    <>
                        <ConfirmationDialog
                            closeDialog={closeConfirmationDialog}
                            action={confirmationDialog.action.value}
                        />
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                                padding: 10,
                                boxSizing: "border-box",
                            }}
                        >
                            {Object.keys(searchResult.value)
                                .filter((group) => searchResult.value[group].length)
                                .map((group) => (
                                    <div key={`search-result-group-${group}`}>
                                        <div style={{ paddingBottom: 5, paddingLeft: 5 }}>
                                            <Text
                                                size={200}
                                                weight="medium"
                                                style={{ color: theme.colorNeutralForeground4 }}
                                            >
                                                {t(`searchResultGroup.${group}`)}
                                            </Text>
                                        </div>
                                        <SearchResultList
                                            containerRef={containerRef}
                                            selectedItemId={selectedItemId.value}
                                            searchResultItems={searchResult.value[group]}
                                            searchTerm={searchTerm.value}
                                            onSearchResultItemClick={handleSearchResultItemClickEvent}
                                            onSearchResultItemDoubleClick={handleSearchResultItemDoubleClickEvent}
                                        />
                                    </div>
                                ))}
                        </div>
                    </>
                )
            }
            footer={
                <Footer draggable>
                    <Button
                        className="non-draggable-area"
                        onClick={openSettings}
                        size="small"
                        appearance="subtle"
                        icon={<SettingsRegular fontSize={14} />}
                    >
                        {t("settings", { ns: "general" })}
                        <div style={{ paddingLeft: 5 }}>
                            <KeyboardShortcut
                                shortcut={contextBridge.getOperatingSystem() === "macOS" ? "⌘+," : "^+,"}
                            />
                        </div>
                    </Button>
                    <div>
                        {searchResult.current() ? (
                            <Button
                                className="non-draggable-area"
                                size="small"
                                appearance="subtle"
                                onClick={invokeSelectedSearchResultItem}
                            >
                                {searchResult.current()?.defaultAction.description}
                                <div style={{ paddingLeft: 5 }}>
                                    <KeyboardShortcut shortcut="↵" />
                                </div>
                            </Button>
                        ) : null}
                        <ActionsMenu
                            searchResultItem={searchResult.current()}
                            favorites={favoriteSearchResultItemIds}
                            invokeAction={invokeAction}
                            additionalActionsButtonRef={additionalActionsButtonRef}
                            open={additionalActionsMenuIsOpen}
                            onOpenChange={toggleAdditionalActionsMenu}
                            keyboardShortcut={contextBridge.getOperatingSystem() === "macOS" ? "⌘+K" : "^+K"}
                        />
                    </div>
                </Footer>
            }
        />
    );
};
