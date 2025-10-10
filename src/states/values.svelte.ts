export let kanjiShowed = (() => {
  let kanji: {
    radical: string;
    furigana: string;
    meaning: string[];
    jlpt: string;
    readings: string[];
    phrases: string[];
  } | null = $state(null)

  return {
    get value() {
      return kanji
    },
    set(nKanji: {
      radical: string;
      furigana: string;
      meaning: string[];
      jlpt: string;
      readings: string[];
      phrases: string[];
    }) {
      kanji = nKanji
    }
  }
})()

