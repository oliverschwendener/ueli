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
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
import { SearchBar } from "./SearchBar";
import type { SearchBarAppearance } from "./SearchBarAppearance";
import type { SearchBarSize } from "./SearchBarSize";
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
        searchResultItems,
        excludedSearchResultItemIds,
        favoriteSearchResultItemIds,
    });

    const searchHistory = useSearchHistoryController();
    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });

    const singleClickBehavior = window.ContextBridge.getSettingValue(
        "keyboardAndMouse.singleClickBehavior",
        "selectSearchResultItem",
    );

    const doubleClickBehavior = window.ContextBridge.getSettingValue(
        "keyboardAndMouse.doubleClickBehavior",
        "invokeSearchResultItem",
    );

    const handleUserInputKeyDownEvent = (keyboardEvent: ReactKeyboardEvent<HTMLElement>) => {
        const eventHandlers: KeyboardEventHandler[] = [
            {
                listener: () => window.ContextBridge.ipcRenderer.send("escapePressed"),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "Escape",
            },
            {
                listener: () => selectedItemId.previous(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowUp",
            },
            {
                listener: () => selectedItemId.previous(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.ctrlKey && keyboardEvent.key === "p",
            },
            {
                listener: () => selectedItemId.next(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.key === "ArrowDown",
            },
            {
                listener: () => selectedItemId.next(),
                needsToInvokeListener: (keyboardEvent) => keyboardEvent.ctrlKey && keyboardEvent.key === "n",
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

    const showKeyboardShortcuts = window.ContextBridge.getSettingValue<boolean>(
        "appearance.showKeyboardShortcuts",
        true,
    );

    const toggleAdditionalActionsMenu = (open: boolean) => {
        setAdditionalActionsMenuIsOpen(open);

        if (!open) {
            userInput.focus();
            userInput.select();
        }
    };

    const windowKeyDownEventHandlers: {
        validate: (e: KeyboardEvent) => boolean;
        action: (e: KeyboardEvent) => void;
    }[] = [
        {
            validate: (event) =>
                window.ContextBridge.getOperatingSystem() === "macOS"
                    ? event.key === "," && event.metaKey
                    : event.key === "," && event.ctrlKey,
            action: (event) => {
                event.preventDefault();
                openSettings();
            },
        },
        {
            validate: (event) =>
                window.ContextBridge.getOperatingSystem() === "macOS"
                    ? event.key === "k" && event.metaKey
                    : event.key === "k" && event.ctrlKey,
            action: (event) => {
                event.preventDefault();
                additionalActionsButtonRef.current?.click();
            },
        },
    ];

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
            for (const { action, validate } of windowKeyDownEventHandlers) {
                if (validate(event)) {
                    action(event);
                }
            }
        };

        window.ContextBridge.ipcRenderer.on("windowFocused", windowFocusedEventHandler);
        window.addEventListener("keydown", keyDownEventHandler);

        return () => {
            window.ContextBridge.ipcRenderer.off("windowFocused", windowFocusedEventHandler);
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
                        searchBarSize={window.ContextBridge.getSettingValue<SearchBarSize>(
                            "appearance.searchBarSize",
                            "large",
                        )}
                        searchBarAppearance={window.ContextBridge.getSettingValue<SearchBarAppearance>(
                            "appearance.searchBarAppearance",
                            "auto",
                        )}
                        searchBarPlaceholderText={window.ContextBridge.getSettingValue(
                            "appearance.searchBarPlaceholderText",
                            t("searchBarPlaceholderText"),
                        )}
                        showIcon={window.ContextBridge.getSettingValue("appearance.showSearchIcon", true)}
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
                window.ContextBridge.getScanCount() === 0 ? (
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
                        {showKeyboardShortcuts && (
                            <div style={{ paddingLeft: 5 }}>
                                <KeyboardShortcut
                                    shortcut={window.ContextBridge.getOperatingSystem() === "macOS" ? "⌘+," : "^+,"}
                                />
                            </div>
                        )}
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
                                {showKeyboardShortcuts && (
                                    <div style={{ paddingLeft: 5 }}>
                                        <KeyboardShortcut shortcut="↵" />
                                    </div>
                                )}
                            </Button>
                        ) : null}
                        <ActionsMenu
                            searchResultItem={searchResult.current()}
                            favorites={favoriteSearchResultItemIds}
                            invokeAction={invokeAction}
                            additionalActionsButtonRef={additionalActionsButtonRef}
                            open={additionalActionsMenuIsOpen}
                            onOpenChange={toggleAdditionalActionsMenu}
                            keyboardShortcut={window.ContextBridge.getOperatingSystem() === "macOS" ? "⌘+K" : "^+K"}
                        />
                    </div>
                </Footer>
            }
        />
    );
};
