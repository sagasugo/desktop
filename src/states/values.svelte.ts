export let kanjiShowed = new class {
  value: {
    radical: string;
    furigana: string;
    meaning: string[];
    jlpt: string;
    readings: string[];
    phrases: string[];
  } | null = $state(null)
}

