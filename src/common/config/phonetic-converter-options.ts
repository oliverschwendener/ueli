export interface PhoneticConverterOptions {
  enabled: boolean;
  prefix: string;
  enableEnglish: boolean;
  enableGerman: boolean;
}

export const defaultPhoneticConverterOptions: PhoneticConverterOptions = {
  enabled: false,
  prefix: "ph?",
  enableEnglish: true,
  enableGerman: false,
};
