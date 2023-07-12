import { Button, Divider, Input } from "@fluentui/react-components";
import { Settings16Filled } from "@fluentui/react-icons";
import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { SearchResultList } from "./SearchResultList";

export const Search: FC = () => {
    const userInputRef = useRef<HTMLInputElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();

    const navigate = useNavigate();

    const openSettings = () => navigate({ pathname: "/settings/general" });

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
                <Input className="non-draggable-area" ref={userInputRef} appearance="filled-darker" size="large" />
            </div>
            <Divider />
            <div style={{ flexGrow: 1, overflowY: "auto" }}>
                <SearchResultList numberOfSearchResults={100} />
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
