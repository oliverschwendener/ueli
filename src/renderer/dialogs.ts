import { ipcRenderer } from "electron";
import { IpcChannels } from "../common/ipc-channels";

export function getFolderPaths(): Promise<string[]> {
    return new Promise((resolve) => {
        ipcRenderer.send(IpcChannels.folderPathRequested);
        ipcRenderer.once(IpcChannels.folderPathResult, (event: Electron.Event, folderPaths: string[]) => {
            resolve(folderPaths);
        });
    });
}
