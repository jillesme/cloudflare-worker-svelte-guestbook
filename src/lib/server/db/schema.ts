import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { user } from "./better-auth-schema";

export const guestbookMessages = sqliteTable("guestbook_messages", {
    id: integer().primaryKey(),
    message: text().notNull(),
    country: text(),
    createdAt: text("created_at", { mode: "text" })
        .notNull()
        .default(sql`CURRENT_TIMESTAMP`),
    userId: text("user_id").notNull().references(() => user.id, {
        onDelete: "cascade",
    }),
});

export * from "./better-auth-schema";