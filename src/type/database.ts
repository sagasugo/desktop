import { kanjis } from "@/db/schema";

export type Kanji = typeof kanjis.$inferSelect;
