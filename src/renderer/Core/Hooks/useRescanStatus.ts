import type { RescanStatus } from "@common/Core";
import type { IpcRendererEvent } from "electron";
import { useEffect, useState } from "react";

export const useRescanStatus = () => {
    const [status, setStatus] = useState<RescanStatus>(window.ContextBridge.getRescanStatus());

    useEffect(() => {
        const statusChange = (_: IpcRendererEvent, { status: newStatus }: { status: RescanStatus }) => {
            setStatus(newStatus);
        };

        window.ContextBridge.ipcRenderer.on("rescanStatusChanged", statusChange);

        return () => {
            window.ContextBridge.ipcRenderer.off("rescanStatusChanged", statusChange);
        };
    }, []);

    return { status };
};
