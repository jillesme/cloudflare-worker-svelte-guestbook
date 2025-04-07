import type { Actions, PageServerLoad } from './$types';
import { guestbookMessages } from '$lib/server/db/schema';
import { desc } from 'drizzle-orm';

export const load: PageServerLoad = async ({ locals }) => {
    const messages = await locals.db.select().from(guestbookMessages).limit(10).orderBy(desc(guestbookMessages.createdAt));
    return {
        messages,
    };
};

export const actions: Actions = {
    default: async ({ request, platform, locals}) => {
        const formData = await request.formData();
        const name = formData.get('name');
        const message = formData.get('message');
        const country = platform?.cf?.country ?? 'Unknown';

        await locals.db.insert(guestbookMessages).values({
            name: name as string,
            message: message as string,
            country: country as string
        });

        return { success: true };
    }
}