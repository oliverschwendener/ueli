import { RescanSate } from "@common/RescanState";
import { useEffect, useState } from "react";

export const useRescanState = () => {
    const [rescanState, setRescanState] = useState<RescanSate>(window.ContextBridge.getRescanState());

    useEffect(() => {
        window.ContextBridge.onRescanStateChanged((rescanState) => setRescanState(rescanState));
    }, []);

    return { rescanState };
};
