import type { SearchResultItem } from "@common/Core";
import { Button, Input } from "@fluentui/react-components";
import { SearchRegular, SettingsRegular } from "@fluentui/react-icons";
import { useEffect, useRef, type KeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { BaseLayout } from "../BaseLayout";
import { Footer } from "../Footer";
import { useContextBridge, useSetting } from "../Hooks";
import { ActionsMenu } from "./ActionsMenu";
import { ConfirmationDialog } from "./ConfirmationDialog";
import type { KeyboardEventHandler } from "./KeyboardEventHandler";
import { ScanIndicator } from "./ScanIndicator";
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
    const { t } = useTranslation();
    const { contextBridge } = useContextBridge();

    const {
        filteredSearchResultItems,
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

    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });

    const { value: singleClickBehavior } = useSetting({
        key: "keyboardAndMouse.singleClickBehavior",
        defaultValue: "selectSearchResultItem",
    });

    const { value: doubleClickBehavior } = useSetting({
        defaultValue: "invokeSearchResultItem",
        key: "keyboardAndMouse.doubleClickBehavior",
    });

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
                listener: async () => await invokeSelectedSearchResultItem(),
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
        invokeSearchResultItem: (s) => invokeAction(s.defaultAction),
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

        contextBridge.ipcRenderer.on("windowFocused", () => setFocusOnUserInputAndSelectText());
    }, []);

    useEffect(() => {
        search(searchTerm.value, selectedItemId.value);
    }, [searchResultItems]);

    useEffect(() => {
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
                        placeholder={t("placeholder", { ns: "search" })}
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
                        <SearchResultList
                            containerRef={containerRef}
                            selectedItemId={selectedItemId.value}
                            searchResultItems={filteredSearchResultItems.value}
                            favorites={favoriteSearchResultItemIds}
                            searchTerm={searchTerm.value}
                            onSearchResultItemClick={handleSearchResultItemClickEvent}
                            onSearchResultItemDoubleClick={handleSearchResultItemDoubleClickEvent}
                        />
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
                        searchResultItem={filteredSearchResultItems.current()}
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
