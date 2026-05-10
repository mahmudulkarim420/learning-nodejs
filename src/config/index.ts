import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const config = {
    PORT: process.env.PORT,
}

export default config;
