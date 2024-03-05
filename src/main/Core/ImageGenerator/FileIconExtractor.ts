import type { Image } from "@common/Core/Image";

export interface FileIconExtractor {
    matchesFilePath: (filePath: string) => boolean;
    extractFileIcon: (filePath: string) => Promise<Image>;
    extractFileIcons: (filePaths: string[]) => Promise<Record<string, Image>>;
}
