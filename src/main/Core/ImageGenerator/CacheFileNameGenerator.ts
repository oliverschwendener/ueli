import { createHash } from "crypto";

export class CacheFileNameGenerator {
    public generateCacheFileName(filePath: string): string {
        return createHash("sha1").update(filePath).digest("hex");
    }
}
