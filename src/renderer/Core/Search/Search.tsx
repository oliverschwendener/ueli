import type { SearchResultItem } from "@common/Core";
import { Button, Input, Text } from "@fluentui/react-components";
import { SearchRegular, SettingsRegular } from "@fluentui/react-icons";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { BaseLayout } from "../BaseLayout";
import { Footer } from "../Footer";
import { useContextBridge, useTheme } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
import { SearchHistory } from "./SearchHistory";
import { useSearchHistoryController } from "./SearchHistoryController";
import { SearchResultList } from "./SearchResultList";
import { useSearchViewcontroller } from "./SearchViewController";

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

    const { theme } = useTheme();

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

    const handleUserInputKeyDownEvent = (keyboardEvent: KeyboardEvent<HTMLElement>) => {
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
                listener: () => additionalActionsButtonRef.current?.click(),
                needsToInvokeListener: (keyboardEvent) =>
                    keyboardEvent.key === "k" && (keyboardEvent.metaKey || keyboardEvent.ctrlKey),
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

    useEffect(() => {
        const setFocusOnUserInputAndSelectText = () => {
            userInput.focus();
            userInput.select();
        };

        setFocusOnUserInputAndSelectText();

        searchHistory.closeMenu();

        contextBridge.ipcRenderer.on("windowFocused", () => {
            setFocusOnUserInputAndSelectText();
            searchHistory.closeMenu();
        });
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
                    </Button>
                    <ActionsMenu
                        searchResultItem={searchResult.current()}
                        favorites={favoriteSearchResultItemIds}
                        invokeAction={invokeAction}
                        additionalActionsButtonRef={additionalActionsButtonRef}
                        onMenuClosed={() => userInput.focus()}
                    />
                </Footer>
            }
        />
    );
};
