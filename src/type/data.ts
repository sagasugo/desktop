import { kanjiMeanings, kanjis, words, wordTranslations } from "@/db/schema";

export type Kana = {
  literal: string;
  romaji: string;
  unicode: string;
  strokeCount: number;
  type: "hiragana" | "katakana";
  gojuonRow?: string;
  gojuonColumn?: string;
  particle?: boolean;
  dakuten?: { literal: string; romaji: string };
  handakuten?: { literal: string; romaji: string };
  youon?: { literal: string; romaji: string }[];
  small?: string;
};

export type Particle = {
  literal: string;
  romaji: string;
  use: string;
};

export type Kanji = typeof kanjis.$inferSelect & {
  meanings: (typeof kanjiMeanings.$inferSelect)[];
};

export type Word = typeof words.$inferSelect & {
  translations: (typeof wordTranslations.$inferSelect)[];
};
