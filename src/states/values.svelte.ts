import type { Kanji, Word } from "@/type";

export let selectedItem = new class {
  #value: Kanji | Word | null = $state(null);
  #onChange: VoidFunction = () => { }

  get value() {
    return this.#value
  }
  set value(it: Kanji | Word | null) {
    this.#value = it;
    this.#onChange()
  }
  set onChange(fn: VoidFunction) {
    this.#onChange = fn
  }

  get itemType(): "kanji" | "word" | null {
    if (!this.#value) return null;
    return "kanji" in this.#value ? "kanji" : "mainWriting" in this.#value ? "word" : null;
  }

  matchKanji(kanji: string): boolean {
    const value = this.#value;
    if (!value) return false
    return 'kanji' in value && value.kanji === kanji;
  }

  matchWord(writing: string): boolean {
    const value = this.#value;
    if (!value) return false
    return 'mainWriting' in value && value.mainWriting === writing;
  }

}


