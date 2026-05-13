import { BaseLayout } from "@Core/BaseLayout";
import { Header } from "@Core/Header";
import { ActionsMenu } from "@Core/Search/ActionsMenu";
import { getNextSearchResultItemId } from "@Core/Search/Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "@Core/Search/Helpers/getPreviousSearchResultItemId";
import { SearchResultList } from "@Core/Search/SearchResultList";
import type { SearchResultListLayout } from "@Core/Search/SearchResultListLayout";
import type { SearchResultItem } from "@common/Core";
import { Button, Input, ProgressBar } from "@fluentui/react-components";
import { ArrowLeftFilled, SearchRegular } from "@fluentui/react-icons";
import type { KeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";
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

    const goBack = () => navigate({ pathname: "/" });

    const handleKeyDownEvent = async (event: KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectNextSearchResultItem();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectPreviousSearchResultItem();
        } else if (event.key === "Enter") {
            event.preventDefault();
            await invokeSelectedSearchResultItem();
        } else if (event.key === "Escape") {
            event.preventDefault();
            goBack();
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
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            gap: 8,
                            padding: 10,
                            boxSizing: "border-box",
                        }}
                    >
                        <ActionsMenu
                            actions={actions}
                            invokeAction={(action) => window.ContextBridge.invokeAction(action)}
                            additionalActionsButtonRef={additionalActionsButtonRef}
                            open={additionalActionsMenuIsOpen}
                            onOpenChange={toggleAdditionalActionsMenu}
                            keyboardShortcut={window.ContextBridge.getOperatingSystem() === "macOS" ? "⌘+K" : "Ctrl+K"}
                        />
                    </div>
                ) : undefined
            }
        />
    );
};
