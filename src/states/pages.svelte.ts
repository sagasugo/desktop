export const kanaPage = new class {
  showRomaji = $state(true)
  kanaMode: "hiragana" | "katakana" = $state("hiragana");
  isVertical = $state(false);
}

export const kanjiPage = new class {

}

export const savedPage = new class {
  mode: "kanji" | "word" = $state("kanji")
}
