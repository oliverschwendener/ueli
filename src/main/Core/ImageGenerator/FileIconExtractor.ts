import type { Image } from "@common/Core/Image";

export interface FileIconExtractor {
    matches: (filePath: string) => boolean;
    extractFileIcon: (filePath: string) => Promise<Image>;
    extractFileIcons: (filePaths: string[]) => Promise<Record<string, Image>>;
}
