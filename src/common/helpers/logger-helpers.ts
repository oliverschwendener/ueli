import * as Winston from "winston";

export const logFormat = Winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);
