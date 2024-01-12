import type { ReactElement } from "react";
import { useNavigate, useParams } from "react-router";
import type { ExtensionProps } from "./ExtensionProps";
import { DeeplTranslator } from "./Extensions";
import { useContextBridge } from "./Hooks";

export const Extension = () => {
    const { contextBridge } = useContextBridge();
    const navigate = useNavigate();
    const extensionId = useParams().extensionId;

    if (!extensionId) {
        return <>Missing extension id</>;
    }

    const props: ExtensionProps = {
        contextBridge,
        goBack: () => navigate({ pathname: "/" }),
    };

    const extensions: Record<string, ReactElement> = {
        DeeplTranslator: <DeeplTranslator {...props} />,
    };

    return extensions[extensionId];
};
