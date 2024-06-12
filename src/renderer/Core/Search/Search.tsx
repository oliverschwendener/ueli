import { KeyboardShortcut } from "@Core/Components";
import { ThemeContext } from "@Core/ThemeContext";
import type { SearchResultItem } from "@common/Core";
import { Button, Input, Text } from "@fluentui/react-components";
import { SearchRegular, SettingsRegular } from "@fluentui/react-icons";
import { useContext, useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { BaseLayout } from "../BaseLayout";
import { Footer } from "../Footer";
import { useContextBridge } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
import { SearchHistory } from "./SearchHistory";
import { useSearchHistoryController } from "./SearchHistoryController";
import { SearchResultList } from "./SearchResultList";
import { useSearchViewcontroller } from "./SearchViewController";

type KeyboardShortcut = {
    shortcut: string;
    listener: (event: KeyboardEvent) => void;
};

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

    const {
        searchResult,
        searchTerm,
        selectedItemId,
        search,
        userInput,
        confirmationDialog,
        invokeAction,
        invokeSelectedSearchResultItem,
    } = useSearchViewcontroller({
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

    const keyboardShortcuts: Record<string, KeyboardShortcut> = {
        openSettings: {
            shortcut: contextBridge.getOperatingSystem() === "macOS" ? "⌘+," : "⌃+,",
            listener: (event: KeyboardEvent) => {
                const shouldInvoke =
                    contextBridge.getOperatingSystem() === "macOS"
                        ? event.key === "," && event.metaKey
                        : event.key === "," && event.ctrlKey;

                if (shouldInvoke) {
                    event.preventDefault();
                    openSettings();
                }
            },
        },
        invokeSelectedItem: {
            shortcut: "↵",
            listener: (event: KeyboardEvent) => {
                if (event.key === "Enter") {
                    event.preventDefault();
                    invokeSelectedSearchResultItem();
                }
            },
        },
        openAdditionalActionsMenu: {
            shortcut: contextBridge.getOperatingSystem() === "macOS" ? "⌘+K" : "⌃+K",
            listener: (event: KeyboardEvent) => {
                const shouldInvoke =
                    contextBridge.getOperatingSystem() === "macOS"
                        ? event.key === "k" && event.metaKey
                        : event.key === "k" && event.ctrlKey;

                if (shouldInvoke) {
                    event.preventDefault();
                    additionalActionsButtonRef.current?.click();
                }
            },
        },
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
        };

        contextBridge.ipcRenderer.on("windowFocused", windowFocusedEventHandler);

        const registerAllEventListeners = () => {
            for (const k of Object.keys(keyboardShortcuts)) {
                const keyboardShortcut = keyboardShortcuts[k] as KeyboardShortcut;
                window.addEventListener("keydown", keyboardShortcut.listener);
            }
        };

        const unregisterAllEventListeners = () => {
            for (const k of Object.keys(keyboardShortcuts)) {
                const keyboardShortcut = keyboardShortcuts[k] as KeyboardShortcut;
                window.removeEventListener("keydown", keyboardShortcut.listener);
            }
        };

        registerAllEventListeners();

        return () => {
            contextBridge.ipcRenderer.off("windowFocused", windowFocusedEventHandler);
            unregisterAllEventListeners();
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
                    <Input
                        className="non-draggable-area"
                        ref={userInput.ref}
                        appearance={contextBridge.themeShouldUseDarkColors() ? "filled-darker" : "filled-lighter"}
                        size="large"
                        value={searchTerm.value}
                        onChange={(_, { value }) => search(value)}
                        onKeyDown={handleUserInputKeyDownEvent}
                        contentBefore={<SearchRegular />}
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
                        placeholder={t("placeholder")}
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
                            <KeyboardShortcut shortcut={keyboardShortcuts["openSettings"].shortcut} />
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
                            onMenuClosed={() => userInput.focus()}
                        />
                    </div>
                </Footer>
            }
        />
    );
};
