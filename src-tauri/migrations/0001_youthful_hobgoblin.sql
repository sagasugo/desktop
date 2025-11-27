CREATE TABLE `saved_kanji` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`kanji` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`kanji`) REFERENCES `kanji`(`kanji`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `saved_word` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`main_writing` text NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`main_writing`) REFERENCES `word`(`main_writing`) ON UPDATE no action ON DELETE no action
);
