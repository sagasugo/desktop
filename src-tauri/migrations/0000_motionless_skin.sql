CREATE TABLE `kanji_translation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kanji` text NOT NULL,
	`language` text NOT NULL,
	`keyword` text,
	`meanings` text DEFAULT '[]',
	`notes` text DEFAULT '[]',
	`auto_translated` integer DEFAULT false,
	FOREIGN KEY (`kanji`) REFERENCES `kanji`(`kanji`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_unicode_translation` ON `kanji_translation` (`kanji`);--> statement-breakpoint
CREATE UNIQUE INDEX `kanji_translation_kanji_language_unique` ON `kanji_translation` (`kanji`,`language`);--> statement-breakpoint
CREATE TABLE `kanji` (
	`kanji` text PRIMARY KEY NOT NULL,
	`unicode` text NOT NULL,
	`stroke_count` integer NOT NULL,
	`jlpt` integer,
	`grade` integer,
	`mainichi_shinbun` integer,
	`main_on_reading` text,
	`main_kun_reading` text,
	`on_readings` text DEFAULT '[]',
	`kun_readings` text DEFAULT '[]',
	`name_readings` text DEFAULT '[]',
	`radicals` text DEFAULT '[]',
	`related_words` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE INDEX `idx_unicode_kanji` ON `kanji` (`kanji`);--> statement-breakpoint
CREATE UNIQUE INDEX `kanji_kanji_unique` ON `kanji` (`kanji`);--> statement-breakpoint
CREATE TABLE `radical_keyword` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`radical` text NOT NULL,
	`language` text NOT NULL,
	`keyword` text NOT NULL,
	FOREIGN KEY (`radical`) REFERENCES `radical`(`radical`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_radical_keyword` ON `radical_keyword` (`radical`);--> statement-breakpoint
CREATE UNIQUE INDEX `radical_keyword_radical_language_unique` ON `radical_keyword` (`radical`,`language`);--> statement-breakpoint
CREATE TABLE `radical` (
	`radical` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reading` (
	`reading` text PRIMARY KEY NOT NULL,
	`main_kanjis` text DEFAULT '[]',
	`name_kanjis` text DEFAULT '[]'
);
--> statement-breakpoint
CREATE TABLE `word_translation` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`writing` text NOT NULL,
	`language` text NOT NULL,
	`main_meaning` text NOT NULL,
	`meanings` text DEFAULT '[]',
	`auto_translated` integer DEFAULT false,
	FOREIGN KEY (`writing`) REFERENCES `word`(`main_writing`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `idx_unicode_word` ON `word_translation` (`writing`);--> statement-breakpoint
CREATE UNIQUE INDEX `word_translation_writing_language_unique` ON `word_translation` (`writing`,`language`);--> statement-breakpoint
CREATE TABLE `word` (
	`main_writing` text PRIMARY KEY NOT NULL,
	`main_reading` text,
	`main_kanjis` text DEFAULT '[]',
	`variants` text DEFAULT '[]'
);
