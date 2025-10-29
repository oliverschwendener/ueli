import type { Logger } from "@Core/Logger";

type FetchPageParams = {
    cursor?: string | null;
    limit: number;
};

type FetchPageResult<T> = {
    results: T[];
    nextCursor: string | null;
};

type FetchPageFn<T> = (params: FetchPageParams) => Promise<FetchPageResult<T>>;

export class TodoistEntityFetcher<T> {
    private static readonly DefaultPageSize = 100;

    public constructor(
        private readonly fetchPage: FetchPageFn<T>,
        private readonly logger: Logger,
        private readonly entityType: string,
    ) {}

    public async fetchAll(pageSize?: number): Promise<T[]> {
        const normalizedPageSize = TodoistEntityFetcher.normalizePageSize(pageSize);
        const aggregated: T[] = [];
        const seenCursors = new Set<string>();
        let cursor: string | undefined;

        while (true) {
            const params: FetchPageParams = { limit: normalizedPageSize };

            if (cursor) {
                params.cursor = cursor;
            }

            const { results, nextCursor } = await this.fetchPage(params);

            aggregated.push(...results);

            if (!nextCursor) {
                break;
            }

            if (seenCursors.has(nextCursor)) {
                this.logger.warn(
                    `TodoistEntityFetcher detected a cursor loop while fetching ${this.entityType}. Last cursor: ${nextCursor}`,
                );
                break;
            }

            seenCursors.add(nextCursor);
            cursor = nextCursor;
        }

        return aggregated;
    }

    private static normalizePageSize(pageSize?: number): number {
        if (typeof pageSize === "number" && Number.isFinite(pageSize) && pageSize > 0) {
            return Math.min(Math.floor(pageSize), 200);
        }

        return TodoistEntityFetcher.DefaultPageSize;
    }
}
