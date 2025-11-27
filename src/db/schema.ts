import { relations } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  unique,
} from "drizzle-orm/sqlite-core";

export const kanjis = sqliteTable(
  "kanji",
  {
    kanji: text().primaryKey().notNull(),
    unicode: text().notNull(),
    strokeCount: integer().notNull(),
    jlpt: integer(),
    grade: integer(),
    mainichiShinbun: integer(),
    mainOnReading: text(),
    mainKunReading: text(),
    onReadings: text({ mode: "json" }).$type<string[]>().default([]),
    kunReadings: text({ mode: "json" }).$type<string[]>().default([]),
    nameReadings: text({ mode: "json" }).$type<string[]>().default([]),
    radicals: text({ mode: "json" }).$type<string[]>().default([]),
    relatedWords: text({ mode: "json" }).$type<string[]>().default([]),
  },
  t => [unique().on(t.kanji), index("idx_unicode_kanji").on(t.kanji)],
);

export const words = sqliteTable("word", {
  mainWriting: text().notNull().primaryKey(),
  mainReading: text(),
  mainKanjis: text({ mode: "json" }).$type<string[]>().default([]),
  variants: text({ mode: "json" })
    .$type<
      {
        reading: string;
        writing: string;
        priorities: string[];
      }[]
    >()
    .default([]),
});

export const radicals = sqliteTable("radical", {
  radical: text().notNull().primaryKey(),
});

export const kanjiMeanings = sqliteTable(
  "kanji_translation",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    kanji: text()
      .notNull()
      .references(() => kanjis.kanji),
    language: text().notNull(),
    keyword: text(),
    meanings: text({ mode: "json" }).$type<string[]>().default([]),
    notes: text({ mode: "json" }).$type<string[]>().default([]),
    autoTranslated: integer({ mode: "boolean" }).default(false),
    // When AI or translation tools are used instead of a professional
  },
  t => [
    unique().on(t.kanji, t.language),
    index("idx_unicode_translation").on(t.kanji),
  ],
);

export const wordTranslations = sqliteTable(
  "word_translation",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    writing: text()
      .notNull()
      .references(() => words.mainWriting),
    language: text().notNull(),
    mainMeaning: text().notNull(),
    meanings: text({ mode: "json" }).$type<string[]>().default([]),
    autoTranslated: integer({ mode: "boolean" }).default(false),
  },
  t => [
    unique().on(t.writing, t.language),
    index("idx_unicode_word").on(t.writing),
  ],
);

export const radicalKeyword = sqliteTable(
  "radical_keyword",
  {
    id: integer().primaryKey({ autoIncrement: true }),
    radical: text()
      .notNull()
      .references(() => radicals.radical),
    language: text().notNull(),
    keyword: text().notNull(),
  },
  t => [
    unique().on(t.radical, t.language),
    index("idx_radical_keyword").on(t.radical),
  ],
);

export const readings = sqliteTable("reading", {
  reading: text().primaryKey().notNull(),
  mainKanjis: text({ mode: "json" }).$type<string[]>().default([]),
  nameKanjis: text({ mode: "json" }).$type<string[]>().default([]),
});

export const savedKanjis = sqliteTable("saved_kanji", {
  id: integer().primaryKey({ autoIncrement: true }),
  kanji: text()
    .notNull()
    .references(() => kanjis.kanji),
  notes: text().notNull().default(""),
});

export const savedWords = sqliteTable("saved_word", {
  id: integer().primaryKey({ autoIncrement: true }),
  mainWriting: text()
    .notNull()
    .references(() => words.mainWriting),
  notes: text().notNull().default(""),
});

export const kanjisRelations = relations(kanjis, ({ one, many }) => ({
  saved: one(savedKanjis),
  meanings: many(kanjiMeanings),
}));

export const savedKanjisRelations = relations(savedKanjis, ({ one }) => ({
  kanji: one(kanjis, {
    fields: [savedKanjis.kanji],
    references: [kanjis.kanji],
  }),
}));

export const kanjiMeaningsRelations = relations(kanjiMeanings, ({ one }) => ({
  kanji: one(kanjis, {
    fields: [kanjiMeanings.kanji],
    references: [kanjis.kanji],
  }),
}));

export const wordsRelations = relations(words, ({ one, many }) => ({
  saved: one(savedWords),
  translations: many(wordTranslations),
}));

export const savedWordsRelations = relations(savedWords, ({ one }) => ({
  word: one(words, {
    fields: [savedWords.mainWriting],
    references: [words.mainWriting],
  }),
}));

export const wordTranslationsRelations = relations(
  wordTranslations,
  ({ one }) => ({
    word: one(words, {
      fields: [wordTranslations.writing],
      references: [words.mainWriting],
    }),
  }),
);
