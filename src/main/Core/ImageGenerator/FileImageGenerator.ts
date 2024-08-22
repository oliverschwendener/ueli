import type { Image } from "@common/Core/Image";
import type { FileImageGenerator as FileImageGeneratorInterface } from "./Contract";
import type { FileIconExtractor } from "./FileIconExtractor";

export class FileImageGenerator implements FileImageGeneratorInterface {
    public constructor(private readonly fileIconExtractors: FileIconExtractor[]) {}

    public async getImage(filePath: string): Promise<Image> {
        for (const fileIconExtractor of this.fileIconExtractors) {
            if (fileIconExtractor.matchesFilePath(filePath)) {
                return await fileIconExtractor.extractFileIcon(filePath);
            }
        }

        throw new Error(
            `Failed to extract file icon from path "${filePath}". Reason: file path did not match any file icon extractor`,
        );
    }

    public async getImages(filePaths: string[]): Promise<Record<string, Image>> {
        let result: Record<string, Image> = {};

        for (const fileIconExtractor of this.fileIconExtractors) {
            const matchingFilePaths = filePaths.filter(
                (filePath) => !Object.keys(result).includes(filePath) && fileIconExtractor.matchesFilePath(filePath),
            );

            result = {
                ...result,
                ...(await fileIconExtractor.extractFileIcons(matchingFilePaths)),
            };
        }

        return result;
    }
}
