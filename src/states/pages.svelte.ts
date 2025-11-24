export const kanaPage = new class {
  showRomaji = $state(true)
  kanaMode: "hiragana" | "katakana" = $state("hiragana");
  isVertical = $state(false);
}

export const kanjiPage = new class {

}
