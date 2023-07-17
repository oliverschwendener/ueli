import { SearchResultItem } from "@common/SearchResultItem";
import { Button, Divider, Input } from "@fluentui/react-components";
import { Settings16Filled } from "@fluentui/react-icons";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { FavoritesList } from "./FavoritesList";
import { SearchResultList } from "./SearchResultList";

type SearchProps = {
    searchResultItems: SearchResultItem[];
};

export const Search = ({ searchResultItems }: SearchProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const userInputRef = useRef<HTMLInputElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();
    const navigate = useNavigate();
    const openSettings = () => navigate({ pathname: "/settings/general" });
    const search = (updatedSearchTerm: string) => setSearchTerm(updatedSearchTerm);

    useEffect(setFocusOnUserInput, []);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <div
                className="draggable-area"
                style={{
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    padding: 10,
                    boxSizing: "border-box",
                }}
            >
                <Input
                    className="non-draggable-area"
                    ref={userInputRef}
                    appearance="filled-darker"
                    size="large"
                    value={searchTerm}
                    onChange={(_, { value }) => search(value)}
                />
            </div>
            <Divider />
            <div style={{ height: "100%", overflowY: "auto" }}>
                {searchTerm.length === 0 ? (
                    <FavoritesList />
                ) : (
                    <SearchResultList searchTerm={searchTerm} searchResultItems={searchResultItems} />
                )}
            </div>
            <Divider />
            <div
                style={{
                    flexShrink: 0,
                    padding: 10,
                    boxSizing: "border-box",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                }}
            >
                <Button onClick={openSettings} size="small" appearance="subtle" icon={<Settings16Filled />}>
                    Settings
                </Button>
            </div>
        </div>
    );
};
