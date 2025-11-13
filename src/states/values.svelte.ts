import type { Kanji } from "@/type"

export let kanjiShowed = new class {
  value: Kanji | null = $state(null)
}

