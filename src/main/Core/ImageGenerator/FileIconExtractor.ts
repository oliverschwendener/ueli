import type { Image } from "@common/Core/Image";

export interface FileIconExtractor {
    validate: (filePath: string) => boolean;
    extractFileIcon: (filePath: string) => Promise<Image>;
}
