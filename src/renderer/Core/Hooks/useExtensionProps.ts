import type { ExtensionProps } from "@Core/ExtensionProps";
import { useNavigate } from "react-router";

export const useExtensionProps = (): ExtensionProps => {
    const navigate = useNavigate();

    return {
        contextBridge: window.ContextBridge,
        goBack: () => navigate({ pathname: "/" }),
    };
};
