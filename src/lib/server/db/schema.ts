import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql, type InferSelectModel } from 'drizzle-orm';


export const guestbookMessages = sqliteTable('guestbook_messages', {
  id: integer().primaryKey(),
  name: text().notNull(),
  message: text().notNull(),
  country: text(),
  createdAt: text('created_at', { mode: 'text' })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});

export type GuestBookMessage = InferSelectModel<typeof guestbookMessages>
