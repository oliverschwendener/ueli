import { Button, Input } from "@fluentui/react-components";
import { FC, useEffect, useRef } from "react";
import { useNavigate } from "react-router";

export const Search: FC = () => {
    const userInputRef = useRef<HTMLInputElement>(null);

    const setFocusOnUserInput = () => userInputRef?.current?.focus();

    const navigate = useNavigate();

    const openSettings = () => {
        navigate({ pathname: "/settings/general" });
        window.ContextBridge.settingsOpenStateChanged({ settingsOpened: true });
    };

    useEffect(setFocusOnUserInput, []);

    return (
        <div>
            <Input ref={userInputRef} appearance="underline" />
            <Button onClick={openSettings}>Open Settings</Button>
        </div>
    );
};
