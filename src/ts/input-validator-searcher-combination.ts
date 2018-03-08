import { InputValidator } from "./input-validators/input-validator";
import { Searcher } from "./searcher/searcher";

export class InputValidatorSearcherCombination {
    public searcher: Searcher;
    public validator: InputValidator;
}
