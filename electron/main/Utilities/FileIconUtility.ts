import { app } from "electron";

export class FileIconUtility {
    public static async getIconDataUrlFromFilePath(filePath: string): Promise<{ filePath: string; dataUrl: string }> {
        const nativeImage = await app.getFileIcon(filePath);

        return {
            filePath,
            dataUrl: nativeImage.toDataURL(),
        };
    }
}
