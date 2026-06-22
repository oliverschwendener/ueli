import { BaseLayout } from "@Core/BaseLayout";
import { KeyboardShortcut } from "@Core/Components";
import { Footer } from "@Core/Footer";
import { Header } from "@Core/Header";
import { ActionsMenu } from "@Core/Search/ActionsMenu";
import { getSearchResultItemActionByKeyboardshortcut } from "@Core/Search/Helpers";
import { getNextSearchResultItemId } from "@Core/Search/Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "@Core/Search/Helpers/getPreviousSearchResultItemId";
import { SearchResultList } from "@Core/Search/SearchResultList";
import type { SearchResultListLayout } from "@Core/Search/SearchResultListLayout";
import type { SearchResultItem } from "@common/Core";
import { Button, Divider, Input, ProgressBar } from "@fluentui/react-components";
import { ArrowLeftFilled, SearchRegular } from "@fluentui/react-icons";
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

type BasicSearchProps = {
    getSearchResultItems: (term: string) => Promise<SearchResultItem[]>;
    inputPlaceholder?: string;
    debounceDurationInMs?: number;
    showGoBackButton?: boolean;
    showFooter?: boolean;
    searchResultListLayout?: SearchResultListLayout;
};

export const BasicSearch = ({
    getSearchResultItems,
    inputPlaceholder,
    debounceDurationInMs,
    showGoBackButton,
    showFooter,
    searchResultListLayout,
}: BasicSearchProps) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);
    const contentRef = useRef<HTMLDivElement>(null);
    const additionalActionsButtonRef = useRef<HTMLButtonElement>(null);
    const [additionalActionsMenuIsOpen, setAdditionalActionsMenuIsOpen] = useState<boolean>(false);

    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>([]);

    const selectNextSearchResultItem = () =>
        setSelectedItemId(getNextSearchResultItemId(selectedItemId, searchResultItems));

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(getPreviousSearchResultItemId(selectedItemId, searchResultItems));

    const selectFirstSearchResultItemItem = () => setSelectedItemId(searchResultItems[0]?.id ?? "");

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        searchResultItems.find((s) => s.id === selectedItemId);

    const selectedSearchResultItem = getSelectedSearchResultItem();
    const actions = selectedSearchResultItem
        ? [
              { ...selectedSearchResultItem.defaultAction, keyboardShortcut: "Enter" },
              ...(selectedSearchResultItem.additionalActions ?? []),
          ]
        : [];

    const toggleAdditionalActionsMenu = (open: boolean) => setAdditionalActionsMenuIsOpen(open);

    const operatingSystem = window.ContextBridge.getOperatingSystem();
    const isMacOS = operatingSystem === "macOS";
    const actionMenuKeyboardShortcut = isMacOS ? "⌘+K" : "Ctrl+K";

    const { t } = useTranslation();

    const currentDefaultActionDescription = () => {
        if (!selectedSearchResultItem) {
            return undefined;
        }

        const defaultAction = selectedSearchResultItem.defaultAction;
        return defaultAction.descriptionTranslation
            ? t(defaultAction.descriptionTranslation.key, {
                  ns: defaultAction.descriptionTranslation.namespace,
              })
            : defaultAction.description;
    };

    const openAdditionalActionsMenu = () => additionalActionsButtonRef.current?.click();

    useEffect(() => {
        const windowKeyDownEventHandler = (event: KeyboardEvent): void => {
            if ((isMacOS ? event.metaKey : event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                openAdditionalActionsMenu();
            }
        };

        window.addEventListener("keydown", windowKeyDownEventHandler);

        return () => window.removeEventListener("keydown", windowKeyDownEventHandler);
    }, [isMacOS]);

    const goBack = () => navigate({ pathname: "/" });

    const handleKeyDownEvent = async (event: ReactKeyboardEvent<HTMLInputElement>) => {
        const isModifierPressed = (keyboardEvent: ReactKeyboardEvent<HTMLInputElement>) =>
            isMacOS ? keyboardEvent.metaKey : keyboardEvent.ctrlKey;

        const eventHandlers: Array<{
            check: (keyboardEvent: ReactKeyboardEvent<HTMLInputElement>) => {
                shouldInvokeAction: boolean;
                action: () => Promise<void> | void;
            };
        }> = [
            {
                check: (keyboardEvent) => ({
                    shouldInvokeAction:
                        keyboardEvent.key === "ArrowDown" ||
                        (isModifierPressed(keyboardEvent) && keyboardEvent.key.toLowerCase() === "n"),
                    action: selectNextSearchResultItem,
                }),
            },
            {
                check: (keyboardEvent) => ({
                    shouldInvokeAction:
                        keyboardEvent.key === "ArrowUp" ||
                        (isModifierPressed(keyboardEvent) && keyboardEvent.key.toLowerCase() === "p"),
                    action: selectPreviousSearchResultItem,
                }),
            },
            {
                check: (keyboardEvent) => ({
                    shouldInvokeAction: keyboardEvent.key === "Escape",
                    action: goBack,
                }),
            },
            {
                check: (keyboardEvent) => {
                    const action = getSearchResultItemActionByKeyboardshortcut(keyboardEvent, actions);

                    return {
                        shouldInvokeAction: action !== undefined,
                        action: async () => {
                            if (action) {
                                await window.ContextBridge.invokeAction(action);
                            }
                        },
                    };
                },
            },
        ];

        for (const eventHandler of eventHandlers) {
            const { shouldInvokeAction, action } = eventHandler.check(event);

            if (shouldInvokeAction) {
                event.preventDefault();
                await Promise.resolve(action());
                break;
            }
        }
    };

    const invokeSelectedSearchResultItem = async () => {
        const selectedSearchResultItem = getSelectedSearchResultItem();

        if (selectedSearchResultItem) {
            await window.ContextBridge.invokeAction(selectedSearchResultItem.defaultAction);
        }
    };

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) => setSelectedItemId(s.id),
        invokeSearchResultItem: (s) => window.ContextBridge.invokeAction(s.defaultAction),
    };

    const handleSearchResultItemClickEvent = (searchResultItem: SearchResultItem) => {
        const singleClickBehavior = window.ContextBridge.getSettingValue(
            "keyboardAndMouse.singleClickBehavior",
            "selectSearchResultItem",
        );

        clickHandlers[singleClickBehavior](searchResultItem);
    };

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) => {
        const doubleClickBehavior = window.ContextBridge.getSettingValue(
            "keyboardAndMouse.doubleClickBehavior",
            "invokeSearchResultItem",
        );

        clickHandlers[doubleClickBehavior](searchResultItem);
    };

    useEffect(() => {
        if (!searchTerm) {
            setIsLoading(false);
            setSearchResultItems([]);
            selectFirstSearchResultItemItem();
            return;
        }

        setIsLoading(true);
        selectFirstSearchResultItemItem();

        if (clearTimeoutValue) {
            clearTimeout(clearTimeoutValue);
        }

        setClearTimeoutValue(
            setTimeout(async () => {
                const s = await getSearchResultItems(searchTerm);
                setClearTimeoutValue(undefined);
                setSearchResultItems(s);
                setSelectedItemId(s[0]?.id ?? "");
                setIsLoading(false);
            }, debounceDurationInMs ?? 250),
        );
    }, [searchTerm]);

    return (
        <BaseLayout
            header={
                <Header
                    draggable
                    contentBefore={
                        showGoBackButton ? (
                            <Button
                                size="small"
                                appearance="subtle"
                                className="non-draggable-area"
                                onClick={goBack}
                                icon={<ArrowLeftFilled fontSize={14} />}
                            ></Button>
                        ) : undefined
                    }
                >
                    <div className="non-draggable-area" style={{ width: "100%" }}>
                        <Input
                            autoFocus
                            style={{ width: "100%" }}
                            value={searchTerm}
                            appearance="filled-darker"
                            onChange={(_, { value }) => setSearchTerm(value)}
                            contentBefore={<SearchRegular />}
                            placeholder={inputPlaceholder}
                            onKeyDown={handleKeyDownEvent}
                        />
                    </div>
                </Header>
            }
            contentRef={contentRef}
            content={
                isLoading ? (
                    <ProgressBar />
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            padding: 10,
                            boxSizing: "border-box",
                        }}
                    >
                        <SearchResultList
                            containerRef={contentRef}
                            onSearchResultItemClick={(s) => handleSearchResultItemClickEvent(s)}
                            onSearchResultItemDoubleClick={(s) => handleSearchResultItemDoubleClickEvent(s)}
                            searchResultItems={searchResultItems}
                            selectedItemId={selectedItemId}
                            layout={searchResultListLayout ?? "compact"}
                        />
                    </div>
                )
            }
            footer={
                showFooter ? (
                    <Footer draggable>
                        <div />
                        <div style={{ display: "flex", flexDirection: "row", gap: 8 }}>
                            {selectedSearchResultItem ? (
                                <Button
                                    className="non-draggable-area"
                                    size="small"
                                    appearance="subtle"
                                    onClick={invokeSelectedSearchResultItem}
                                >
                                    <div
                                        style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 8 }}
                                    >
                                        {currentDefaultActionDescription()}
                                        <KeyboardShortcut shortcut="Enter" />
                                    </div>
                                </Button>
                            ) : null}
                            <Divider appearance="subtle" vertical />
                            <ActionsMenu
                                actions={actions}
                                invokeAction={(action) => window.ContextBridge.invokeAction(action)}
                                additionalActionsButtonRef={additionalActionsButtonRef}
                                open={additionalActionsMenuIsOpen}
                                onOpenChange={toggleAdditionalActionsMenu}
                                keyboardShortcut={actionMenuKeyboardShortcut}
                            />
                        </div>
                    </Footer>
                ) : undefined
            }
        />
    );
};
