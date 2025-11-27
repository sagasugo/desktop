import {
  kanjiMeanings,
  kanjis,
  savedKanjis,
  savedWords,
  words,
  wordTranslations,
} from "@/db/schema";

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
  saved: typeof savedKanjis.$inferSelect | null;
  meanings: (typeof kanjiMeanings.$inferSelect)[];
};

export type Word = typeof words.$inferSelect & {
  saved: typeof savedWords.$inferSelect | null;
  translations: (typeof wordTranslations.$inferSelect)[];
};
