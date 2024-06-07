export class ScanCounter {
    public constructor(private scanCount = 0) {}

    public increment() {
        this.scanCount++;
    }

    public getScanCount() {
        return this.scanCount;
    }
}
