ALTER TABLE `guestbook_messages` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `guestbook_messages` DROP COLUMN `name`;