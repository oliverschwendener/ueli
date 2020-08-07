type PhoneticAlphabet = Record<string, string>;

export class PhoneticConverter {

  public static convert(input: string, lang: string): string {

    let alphabet: PhoneticAlphabet;

    const ENGLISH_ALPHABET: PhoneticAlphabet = {
      a: "Alpha",
      b: "Bravo",
      c: "Charlie",
      d: "Delta",
      e: "Echo",
      f: "Foxtrot",
      g: "Golf",
      h: "Hotel",
      i: "India",
      j: "Juliett",
      k: "Kilo",
      l: "Lima",
      m: "Mike",
      n: "November",
      o: "Oscar",
      p: "Papa",
      q: "Quebec",
      r: "Romeo",
      s: "Sierra",
      t: "Tango",
      u: "Uniform",
      v: "Victor",
      w: "Whiskey",
      x: "X-ray",
      y: "Yankee",
      z: "Zulu",
      space: "[SPACE]",
    };

    const GERMAN_ALPHABET: PhoneticAlphabet = {
      a: "Anton",
      b: "Berta",
      c: "Cäsar",
      d: "Dora",
      e: "Emil",
      f: "Friedrich",
      g: "Gustav",
      h: "Heinrich",
      i: "Ida",
      j: "Julius",
      k: "Konrad",
      l: "Ludwig",
      m: "Martha",
      n: "Nordpol",
      o: "Otto",
      p: "Paula",
      q: "Quelle",
      r: "Richard",
      s: "Siegfried",
      t: "Theodor",
      u: "Ulrich",
      v: "Viktor",
      w: "Wilhelm",
      x: "Xaver",
      y: "Ypsilon",
      z: "Zeppelin",
      space: "[LEER]",
    };

    switch (lang) {
      case "eng":
        alphabet = ENGLISH_ALPHABET;
        break;
      case "ger":
        alphabet = GERMAN_ALPHABET;
        break;
      default:
        alphabet = ENGLISH_ALPHABET;
    }

    return [...input.toLowerCase()]
      .map((x: string) => {
        if (x in alphabet) {
          return alphabet[x];
        } else {
          if (x === " ") return alphabet.space;
          else return x;
        }
      })
      .join(" ");
  }
}

