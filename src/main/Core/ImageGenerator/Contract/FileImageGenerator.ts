import type { Image } from "@common/Core/Image";

export interface FileImageGenerator {
    getImage(filePath: string): Promise<Image>;
    clearCache: () => Promise<void>;
}
