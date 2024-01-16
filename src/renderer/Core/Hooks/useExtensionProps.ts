import { ExtensionProps } from "@Core/ExtensionProps";
import { useNavigate } from "react-router";
import { useContextBridge } from "./useContextBridge";

export const useExtensionProps = (): ExtensionProps => {
    const navigate = useNavigate();
    const { contextBridge } = useContextBridge();

    return {
        contextBridge,
        goBack: () => navigate({ pathname: "/" }),
    };
};
