// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
import {sqliteTable,text,integer,primaryKey,index,uniqueIndex} from 'drizzle-orm/sqlite-core';
export const users=sqliteTable('users',{id:text('id').primaryKey(),username:text('username').notNull(),role:text('role').notNull().default('player'),status:text('status').notNull().default('active'),data:text('data').notNull(),revision:integer('revision').notNull().default(0),updated:integer('updated').notNull(),lastLogin:integer('last_login').notNull()});
export const wallets=sqliteTable('wallets',{userId:text('user_id').primaryKey().references(()=>users.id),coins:integer('coins').notNull().default(0)});
export const inventory=sqliteTable('player_inventory',{userId:text('user_id').notNull().references(()=>users.id),itemId:text('item_id').notNull(),created:integer('created').notNull()},t=>[primaryKey({columns:[t.userId,t.itemId]})]);
export const ledger=sqliteTable('coin_transactions',{id:text('id').primaryKey(),userId:text('user_id').notNull().references(()=>users.id),claim:text('claim').notNull(),kind:text('kind').notNull(),delta:integer('delta').notNull(),itemId:text('item_id'),actor:text('actor').notNull(),created:integer('created').notNull()},t=>[uniqueIndex('ledger_claim').on(t.userId,t.claim),index('ledger_user').on(t.userId,t.created)]);
export const sessions=sqliteTable('game_sessions',{id:text('id').primaryKey(),userId:text('user_id').notNull().references(()=>users.id),game:text('game').notNull(),level:integer('level').notNull(),difficulty:integer('difficulty').notNull(),seed:integer('seed').notNull(),started:integer('started').notNull(),result:text('result')},t=>[index('session_user').on(t.userId,t.started)]);
export const audit=sqliteTable('audit_logs',{id:integer('id').primaryKey({autoIncrement:true}),actor:text('actor').notNull(),target:text('target').notNull(),action:text('action').notNull(),details:text('details').notNull(),created:integer('created').notNull()});
export const settings=sqliteTable('admin_settings',{key:text('key').primaryKey(),value:text('value').notNull()});
export const limits=sqliteTable('rate_limits',{key:text('key').primaryKey(),count:integer('count').notNull()});
export const cache=sqliteTable('preset_cache',{id:text('id').primaryKey(),data:text('data').notNull(),created:integer('created').notNull()});
