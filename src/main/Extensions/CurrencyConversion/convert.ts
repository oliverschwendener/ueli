import type { Rates } from "./Rates";

export const convert = ({
    value,
    base,
    target,
    rates,
}: {
    value: number;
    base: string;
    target: string;
    rates: Rates;
}): { result: number; target: string } => {
    if (!Object.keys(rates).includes(base.toLowerCase())) {
        throw new Error("Base currency not found");
    }

    if (!Object.keys(rates[base.toLowerCase()]).includes(target.toLowerCase())) {
        throw new Error("Target currency not found");
    }

    return {
        result: value * rates[base.toLowerCase()][target.toLowerCase()],
        target,
    };
};
