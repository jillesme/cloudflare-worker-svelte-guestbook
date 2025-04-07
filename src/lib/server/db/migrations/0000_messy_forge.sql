CREATE TABLE `guestbook_messages` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`message` text NOT NULL,
	`country` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
