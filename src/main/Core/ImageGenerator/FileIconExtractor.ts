import type { Image } from "@shared/Core/Image";

export interface FileIconExtractor {
    matchesFilePath: (filePath: string) => boolean;
    extractFileIcon: (filePath: string) => Promise<Image>;
    extractFileIcons: (filePaths: string[]) => Promise<Record<string, Image>>;
}
