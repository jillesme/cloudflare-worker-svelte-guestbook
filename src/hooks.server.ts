import type { Handle } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
import { getDb } from "$lib/server/db";

export const handle: Handle = async ({ event, resolve }) => {
    event.locals.db = getDb(event.platform?.env?.DB, env.DATABASE_URL);

    const response = await resolve(event);
    return response;
};
