import { db } from "@/db/client";
import { savedKanjis, savedWords } from "@/db/schema";
import type { Kanji, Word } from "@/type";

export const kanaPage = new class {
  showRomaji = $state(true)
  kanaMode: "hiragana" | "katakana" = $state("hiragana");
  isVertical = $state(false);
}

export const kanjiPage = new class {
  jlpt: string = $state("")
  grade: string = $state("")
  compareMode: boolean = $state(false)
  comparedKanjis: Kanji[] = $state([])
}

export const savedPage = new class {
  mode: "kanji" | "word" = $state("kanji")
  kanjis: Kanji[] = $state([])
  words: Word[] = $state([])

  refreshKanjis = async () => {
    this.kanjis = await db.query.kanjis.findMany({
      with: { saved: true, meanings: true },
      where: (kanjis, { exists, eq }) => exists(
        db.select()
          .from(savedKanjis)
          .where(eq(savedKanjis.kanji, kanjis.kanji)))
    })
  }

  refreshWords = async () => {
    this.words = await db.query.words.findMany({
      with: { saved: true, translations: true },
      where: (words, { exists, eq }) => exists(
        db.select()
          .from(savedWords)
          .where(eq(savedWords.mainWriting, words.mainWriting))
      )
    })
  }
}
