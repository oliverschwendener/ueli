import Winston from "winston";

export const logFormat = Winston.format.printf(
    ({ level, message, timestamp, stack }) => `${timestamp} ${level}: ${message}${stack ? "\n" + stack : ""}`,
);
