import { clipboard } from "electron";

export async function electronClipboardCopier(value: string): Promise<void> {
    clipboard.writeText(value);
}
