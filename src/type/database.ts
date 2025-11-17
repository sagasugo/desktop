import { kanjiMeanings, kanjis, words, wordTranslations } from "@/db/schema";

export type Kanji = typeof kanjis.$inferSelect & {
  meanings: (typeof kanjiMeanings.$inferSelect)[];
};

export type Word = typeof words.$inferSelect & {
  translations: (typeof wordTranslations.$inferSelect)[];
};
