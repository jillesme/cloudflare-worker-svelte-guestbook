import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { createD1Client, createLibSqlClient } from '$lib/server/db';

const db = env.DATABASE_URL ? createLibSqlClient(env.DATABASE_URL) : null;

export const handle: Handle = async ({ event, resolve }) => {
    if (event.platform?.env.DB) {
        event.locals.db = createD1Client(event.platform.env.DB);
    } else if (db) {
        event.locals.db = db;
    } else {
        throw new Error('No database found');
    }

	const response = await resolve(event);
	return response;
};