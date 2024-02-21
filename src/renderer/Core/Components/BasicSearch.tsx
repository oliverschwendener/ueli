import { BaseLayout } from "@Core/BaseLayout";
import { Header } from "@Core/Header";
import { useContextBridge } from "@Core/Hooks";
import { SearchResultList } from "@Core/Search/SearchResultList";
import type { SearchResultItem } from "@common/Core";
import { Button, Input, ProgressBar } from "@fluentui/react-components";
import { ArrowLeftFilled, SearchRegular } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
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
    const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
    const [clearTimeoutValue, setClearTimeoutValue] = useState<NodeJS.Timeout | undefined>(undefined);
    const contentRef = useRef(null);

    const [searchResultItems, setSearchResultItems] = useState<SearchResultItem[]>([]);

    const selectNextSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === searchResultItems.length - 1 ? 0 : selectedItemIndex + 1);

    const selectPreviousSearchResultItem = () =>
        setSelectedItemIndex(selectedItemIndex === 0 ? searchResultItems.length - 1 : selectedItemIndex - 1);

    const selectFirstSearchResultItemItem = () => setSelectedItemIndex(0);

    const getSelectedSearchResultItem = (): SearchResultItem | undefined => searchResultItems[selectedItemIndex];

    const goBack = () => navigate({ pathname: "/" });

    const handleKeyDownEvent = (event: React.KeyboardEvent) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            selectNextSearchResultItem();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            selectPreviousSearchResultItem();
        } else if (event.key === "Enter") {
            event.preventDefault();
            invokeSelectedSearchResultItem();
        }
    };

    const invokeSelectedSearchResultItem = () => {
        const selectedSearchResultItem = getSelectedSearchResultItem();

        if (selectedSearchResultItem) {
            contextBridge.invokeAction(selectedSearchResultItem.defaultAction);
        }
    };

    const clickHandlers: Record<string, (s: SearchResultItem) => void> = {
        selectSearchResultItem: (s) =>
            setSelectedItemIndex(searchResultItems.findIndex((searchResultItem) => searchResultItem.id === s.id)),
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
                        favorites={[]}
                        selectedItemIndex={selectedItemIndex}
                        searchTerm={searchTerm}
                    />
                )
            }
        />
    );
};
