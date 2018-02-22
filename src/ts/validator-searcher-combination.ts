import { InputValidator } from "./input-validators/input-validator";
import { Searcher } from "./searcher/searcher";

export class ValidatorSearcherCombination {
    public searcher: Searcher;
    public validator: InputValidator;
}
