import { readFileSync } from "fs";
import path from "path";

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');

export const readProduct = () => {
    const data = readFileSync(dbPath, 'utf-8');
    const products = JSON.parse(data);
    return products;
}