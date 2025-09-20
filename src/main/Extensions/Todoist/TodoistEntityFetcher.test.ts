import type { Logger } from "@Core/Logger";
import { describe, expect, it, vi } from "vitest";
import { TodoistEntityFetcher } from "./TodoistEntityFetcher";

const createLogger = (): Logger => ({
    debug: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
});

describe(TodoistEntityFetcher, () => {
    it("fetches a single page", async () => {
        const fetchPage = vi.fn().mockResolvedValue({
            results: [{ id: "1" }],
            nextCursor: null,
        });
        const fetcher = new TodoistEntityFetcher(fetchPage, createLogger(), "labels");

        const results = await fetcher.fetchAll(15);

        expect(results).toHaveLength(1);
        expect(fetchPage).toHaveBeenCalledWith({ limit: 15 });
    });

    it("collects multiple pages", async () => {
        type TestEntity = { id: string };
        const fetchPage = vi
            .fn<
                (params: {
                    limit: number;
                    cursor?: string | null;
                }) => Promise<{ results: TestEntity[]; nextCursor: string | null }>
            >()
            .mockResolvedValueOnce({
                results: [{ id: "1" }],
                nextCursor: "cursor-1",
            })
            .mockResolvedValueOnce({
                results: [{ id: "2" }],
                nextCursor: null,
            });

        const fetcher = new TodoistEntityFetcher<TestEntity>(fetchPage, createLogger(), "projects");

        const results = await fetcher.fetchAll(10);

        expect(results.map((item) => item.id)).toEqual(["1", "2"]);
        expect(fetchPage).toHaveBeenCalledTimes(2);
        expect(fetchPage).toHaveBeenNthCalledWith(1, { limit: 10 });
        expect(fetchPage).toHaveBeenNthCalledWith(2, { limit: 10, cursor: "cursor-1" });
    });

    it("warns and stops when cursor loops", async () => {
        const fetchPage = vi
            .fn<
                (params: {
                    limit: number;
                    cursor?: string | null;
                }) => Promise<{ results: { id: string }[]; nextCursor: string | null }>
            >()
            .mockResolvedValue({
                results: [],
                nextCursor: "cursor-1",
            });

        const logger = createLogger();
        const fetcher = new TodoistEntityFetcher<{ id: string }>(fetchPage, logger, "labels");

        const results = await fetcher.fetchAll(5);

        expect(results).toHaveLength(0);
        expect(fetchPage).toHaveBeenCalledTimes(2);
        expect(logger.warn).toHaveBeenCalledWith(
            "TodoistEntityFetcher detected a cursor loop while fetching labels. Last cursor: cursor-1",
        );
    });
});
