import { InputValidator } from "./input-validators/input-validator";
import { Searcher } from "./searcher/searcher";

export interface InputValidatorSearcherCombination {
    searcher: Searcher;
    validator: InputValidator;
}
