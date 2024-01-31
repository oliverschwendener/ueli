import type { Clock } from "@Core/Clock/Clock";
import { describe, expect, it, vi } from "vitest";
import { Logger } from "./Logger";

describe(Logger, () => {
    const nowAsString = "2024-01-13 11:31:52";

    it("should log an error", () => {
        const getCurrentTimeAsStringMock = vi.fn().mockReturnValue(nowAsString);

        const logger = new Logger(<Clock>{ getCurrentTimeAsString: () => getCurrentTimeAsStringMock() });

        logger.error("This is an error");

        expect(logger.getLogs()).toEqual([`[${nowAsString}][ERROR] This is an error`]);
        expect(getCurrentTimeAsStringMock).toHaveBeenCalledOnce();
    });

    it("should log a debug message", () => {
        const getCurrentTimeAsStringMock = vi.fn().mockReturnValue(nowAsString);

        const logger = new Logger(<Clock>{ getCurrentTimeAsString: () => getCurrentTimeAsStringMock() });

        logger.debug("This is a debug message");

        expect(logger.getLogs()).toEqual([`[${nowAsString}][DEBUG] This is a debug message`]);
        expect(getCurrentTimeAsStringMock).toHaveBeenCalledOnce();
    });

    it("should log a info message", () => {
        const getCurrentTimeAsStringMock = vi.fn().mockReturnValue(nowAsString);

        const logger = new Logger(<Clock>{ getCurrentTimeAsString: () => getCurrentTimeAsStringMock() });

        logger.info("This is a info message");

        expect(logger.getLogs()).toEqual([`[${nowAsString}][INFO] This is a info message`]);
        expect(getCurrentTimeAsStringMock).toHaveBeenCalledOnce();
    });

    it("should log a warning", () => {
        const getCurrentTimeAsStringMock = vi.fn().mockReturnValue(nowAsString);

        const logger = new Logger(<Clock>{ getCurrentTimeAsString: () => getCurrentTimeAsStringMock() });

        logger.warn("This is a warning");

        expect(logger.getLogs()).toEqual([`[${nowAsString}][WARNING] This is a warning`]);
        expect(getCurrentTimeAsStringMock).toHaveBeenCalledOnce();
    });
});
