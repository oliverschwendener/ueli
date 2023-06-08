import { Button, Input } from "@fluentui/react-components";
import { FC } from "react";
import { useNavigate } from "react-router";

export const Search: FC = () => {
    const navigate = useNavigate();

    const openSettings = () => {
        navigate({ pathname: "/settings/general" });
        window.ContextBridge.settingsOpenStateChanged({ settingsOpened: true });
    };

    return (
        <div>
            <Input appearance="underline" />
            <Button onClick={openSettings}>Open Settings</Button>
        </div>
    );
};
