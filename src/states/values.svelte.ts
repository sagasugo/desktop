import type { Kanji } from "@/type";

export let selectedKanji = new (class {
  k: Kanji | null = $state(null);
})();
