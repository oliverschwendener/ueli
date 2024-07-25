export type InvocationArgument = {
    invocationString: string;
    encodingType: EncodingType;
};

export enum EncodingType {
    Encode,
    Decode,
}
