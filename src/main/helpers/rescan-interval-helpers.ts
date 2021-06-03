export function getRescanIntervalInMilliseconds(
    rescanIntervalInSeconds: number,
    minimumRescanIntervalInSeconds?: number,
): number {
    if (minimumRescanIntervalInSeconds && rescanIntervalInSeconds < minimumRescanIntervalInSeconds) {
        return minimumRescanIntervalInSeconds * 1000;
    }

    return rescanIntervalInSeconds * 1000;
}
