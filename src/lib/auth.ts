import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { type DrizzleClient, getDb } from "$lib/server/db";
import { env } from "$env/dynamic/private";

// export const auth = betterAuth({
//     database: drizzleAdapter(getDb(undefined, 'file:.wrangler/state/v3/d1/miniflare-D1DatabaseObject/4319b10855ad3a1a9ad03df5c0a86f8703bd3a3b07f0061aeb379105807a53d0.sqlite'), {
//         provider: "sqlite", // or "mysql", "sqlite"
//     }),
//     socialProviders: {
//         google: {
//             clientId: env.GOOGLE_CLIENT_ID,
//             clientSecret: env.GOOGLE_CLIENT_SECRET,
//         }
//     }
// });

export function getAuth(db: DrizzleClient) {
    return betterAuth({
        database: drizzleAdapter(db, {
            provider: "sqlite", // or "mysql", "sqlite"
        }),
        socialProviders: {
            google: {
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            }
        }
    });
}

export type BetterAuth = ReturnType<typeof getAuth>;