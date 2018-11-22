import { CountRepository } from "./count-repository";
import { Count } from "./count";

export class CountManager {
    private readonly countRepository: CountRepository;

    constructor(countRepository: CountRepository) {
        this.countRepository = countRepository;
    }

    public increaseCount(key: string): void {
        let score = this.countRepository.getCount()[key];

        if (isNaN(score)) {
            score = 0;
        }

        score++;

        const count = this.countRepository.getCount();

        count[key] = score;

        this.countRepository.updateCount(count);
    }

    public getCount(): Count {
        return this.countRepository.getCount();
    }
}
