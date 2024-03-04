import type { Image } from "@common/Core/Image";

export interface FileIconExtractor {
    machtes: (filePath: string) => boolean;
    extractFileIcon: (filePath: string) => Promise<Image>;
}
