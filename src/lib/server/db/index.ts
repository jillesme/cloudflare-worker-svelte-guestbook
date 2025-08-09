import { drizzle as drizzleLibSql } from 'drizzle-orm/libsql';
import { drizzle as drizzleD1 } from 'drizzle-orm/d1';
import { createClient } from '@libsql/client';
import * as schema from './schema';

export function getDb(platformEnv?: { DB?: D1Database }, databaseUrl?: string) {
    if (platformEnv?.DB) {
        return drizzleD1(platformEnv.DB, { schema });
    }
    
    if (databaseUrl) {
        const client = createClient({ url: databaseUrl });
        return drizzleLibSql(client, { schema });
    }
    
    throw new Error('No database configuration found');
}