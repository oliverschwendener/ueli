import type { SearchResultItem, SearchResultItemAction } from "@common/Core";
import { Button, Input } from "@fluentui/react-components";
import { SearchRegular, SettingsRegular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
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

    const { filteredSearchResultItems, searchTerm, selectedItemId, search } = useSearchViewcontroller({
        contextBridge,
        searchResultItems,
        excludedSearchResultItemIds,
        favoriteSearchResultItemIds,
    });

    const [confirmationDialogAction, setConfirmationDialogAction] = useState<SearchResultItemAction | undefined>(
        undefined,
    );

    const userInputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();

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

    const invokeSelectedSearchResultItem = async () => {
        const searchResultItem = filteredSearchResultItems.current();

        if (!searchResultItem || !searchResultItem.defaultAction) {
            return;
        }

        await invokeAction(searchResultItem.defaultAction);
    };

    const invokeAction = async (action: SearchResultItemAction) => {
        if (!action.requiresConfirmation) {
            await contextBridge.invokeAction(action);
            return;
        }

        // This timeout is a workaround. Without it, for some reason the close button in the confirmation dialog will
        // trigger an "onClick" event and therefore will be closed immediately.
        setTimeout(() => setConfirmationDialogAction(action), 100);
    };

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
        setConfirmationDialogAction(undefined);
        setFocusOnUserInput();
    };

    useEffect(() => {
        const setFocusOnUserInputAndSelectText = () => {
            userInputRef?.current?.focus();
            userInputRef?.current?.select();
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
                        ref={userInputRef}
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
                        <ConfirmationDialog closeDialog={closeConfirmationDialog} action={confirmationDialogAction} />
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
                        onMenuClosed={() => setFocusOnUserInput()}
                    />
                </Footer>
            }
        />
    );
};
