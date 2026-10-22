CREATE TABLE `audit_logs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`actor` text NOT NULL,
	`target` text NOT NULL,
	`action` text NOT NULL,
	`details` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `preset_cache` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`created` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_inventory` (
	`user_id` text NOT NULL,
	`item_id` text NOT NULL,
	`created` integer NOT NULL,
	PRIMARY KEY(`user_id`, `item_id`),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `coin_transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`claim` text NOT NULL,
	`kind` text NOT NULL,
	`delta` integer NOT NULL,
	`item_id` text,
	`actor` text NOT NULL,
	`created` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ledger_claim` ON `coin_transactions` (`user_id`,`claim`);--> statement-breakpoint
CREATE INDEX `ledger_user` ON `coin_transactions` (`user_id`,`created`);--> statement-breakpoint
CREATE TABLE `rate_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `game_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`game` text NOT NULL,
	`level` integer NOT NULL,
	`difficulty` integer NOT NULL,
	`seed` integer NOT NULL,
	`started` integer NOT NULL,
	`result` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `session_user` ON `game_sessions` (`user_id`,`started`);--> statement-breakpoint
CREATE TABLE `admin_settings` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`role` text DEFAULT 'player' NOT NULL,
	`status` text DEFAULT 'active' NOT NULL,
	`data` text NOT NULL,
	`revision` integer DEFAULT 0 NOT NULL,
	`updated` integer NOT NULL,
	`last_login` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`user_id` text PRIMARY KEY NOT NULL,
	`coins` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TRIGGER purchase_check BEFORE INSERT ON coin_transactions
WHEN NEW.kind='purchase' AND NOT EXISTS (SELECT 1 FROM coin_transactions WHERE user_id=NEW.user_id AND claim=NEW.claim)
BEGIN
 SELECT CASE WHEN (SELECT coins FROM wallets WHERE user_id=NEW.user_id)<-NEW.delta THEN RAISE(ABORT,'insufficient funds') END;
 SELECT CASE WHEN EXISTS(SELECT 1 FROM player_inventory WHERE user_id=NEW.user_id AND item_id=NEW.item_id) THEN RAISE(ABORT,'already owned') END;
END;
--> statement-breakpoint
CREATE TRIGGER ledger_apply AFTER INSERT ON coin_transactions
BEGIN
 UPDATE wallets SET coins=MAX(0,coins+NEW.delta) WHERE user_id=NEW.user_id;
 INSERT OR IGNORE INTO player_inventory (user_id,item_id,created) SELECT NEW.user_id,NEW.item_id,NEW.created WHERE NEW.kind='purchase';
 INSERT INTO audit_logs(actor,target,action,details,created) VALUES(NEW.actor,NEW.user_id,NEW.kind,json_object('delta',NEW.delta,'claim',NEW.claim,'item',NEW.item_id),NEW.created);
END;
