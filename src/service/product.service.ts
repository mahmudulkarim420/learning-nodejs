import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { IProduct } from "../types/product.type.js";

const dbPath = path.join(process.cwd(), 'src', 'database', 'db.json');

export const readProduct = () => {
    const data = readFileSync(dbPath, 'utf-8');
    const products = JSON.parse(data);
    return products;
}


export const createProduct = (payload: IProduct) => {
    const products = readProduct();
    products.push(payload);
    writeFileSync(dbPath, JSON.stringify(products));
}