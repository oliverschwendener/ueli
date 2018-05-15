import { CountRepository } from "./count-repository";

export class CountManager {
    private countRepository: CountRepository;

    constructor(countRepository: CountRepository) {
        this.countRepository = countRepository;
    }

    public increaseCount(key: string): void {
        let score = this.countRepository.getScore(key);

        if (isNaN(score)) {
            score = 0;
        }

        score++;

        const count = this.countRepository.getCount();

        count[key] = score;

        this.countRepository.updateCount(count);
    }

    public getScore(key: string): number {
        let score = this.countRepository.getScore(key);

        if (isNaN(score)) {
            score = 0;
        }

        return score;
    }
}
