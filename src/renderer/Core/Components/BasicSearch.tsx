import { BaseLayout } from "@Core/BaseLayout";
import { Header } from "@Core/Header";
import { useContextBridge } from "@Core/Hooks";
import { getNextSearchResultItemId } from "@Core/Search/Helpers/getNextSearchResultItemId";
import { getPreviousSearchResultItemId } from "@Core/Search/Helpers/getPreviousSearchResultItemId";
import { SearchResultList } from "@Core/Search/SearchResultList";
import type { SearchResultItem } from "@common/Core";
import { Button, Input, ProgressBar } from "@fluentui/react-components";
import { ArrowLeftFilled, SearchRegular } from "@fluentui/react-icons";
import { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

type BasicSearchProps = {
    getSearchResultItems: (term: string) => Promise<SearchResultItem[]>;
    inputPlaceholder?: string;
    debounceDurationInMs?: number;
    showGoBackButton?: boolean;
};

export const BasicSearch = ({
    getSearchResultItems,
    inputPlaceholder,
    debounceDurationInMs,
    showGoBackButton,
}: BasicSearchProps) => {
    const { contextBridge } = useContextBridge();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [selectedItemId, setSelectedItemId] = useState<string>("");
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);
    const contentRef = useRef(null);

    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>([]);

    const selectNextSearchResultItem = () =>
        setSelectedItemId(getNextSearchResultItemId(selectedItemId, searchResultItems));

    const selectPreviousSearchResultItem = () =>
        setSelectedItemId(getPreviousSearchResultItemId(selectedItemId, searchResultItems));

    const selectFirstSearchResultItemItem = () => setSelectedItemId(searchResultItems[0]?.id ?? "");

    const getSelectedSearchResultItem = (): SearchResultItem | undefined =>
        searchResultItems.find((s) => s.id === selectedItemId);

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
        }
    };

    const invokeSelectedSearchResultItem = async () => {
        const selectedSearchResultItem = getSelectedSearchResultItem();

        if (selectedSearchResultItem) {
            await contextBridge.invokeAction(selectedSearchResultItem.defaultAction);
        }
    };

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) => setSelectedItemId(s.id),
        invokeSearchResultItem: (s) => contextBridge.invokeAction(s.defaultAction),
    };

    const handleSearchResultItemClickEvent = (searchResultItem: SearchResultItem) => {
        const singleClickBehavior = contextBridge.getSettingValue(
            "keyboardAndMouse.singleClickBehavior",
            "selectSearchResultItem",
        );

        clickHandlers[singleClickBehavior](searchResultItem);
    };

    const handleSearchResultItemDoubleClickEvent = (searchResultItem: SearchResultItem) => {
        const doubleClickBehavior = contextBridge.getSettingValue(
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
                    <SearchResultList
                        containerRef={contentRef}
                        onSearchResultItemClick={(s) => handleSearchResultItemClickEvent(s)}
                        onSearchResultItemDoubleClick={(s) => handleSearchResultItemDoubleClickEvent(s)}
                        searchResultItems={searchResultItems}
                        selectedItemId={selectedItemId}
                        searchTerm={searchTerm}
                    />
                )
            }
        />
    );
};
