import type { Kanji, Word } from "@/type";

export let selectedKanji = new (class {
  k: Kanji | null = $state(null);
})();

export let selectedWord = new (class {
  w: Word | null = $state(null);
})();
