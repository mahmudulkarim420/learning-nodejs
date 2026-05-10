import { readFileSync, writeFileSync } from "fs";
import path from "path";
import type { IProduct } from "../types/product.type.js";

const dbPath = path.join(process.cwd(), "src", "database", "db.json");

export const readProduct = () => {
  const data = readFileSync(dbPath, "utf-8");
  const products = JSON.parse(data);
  return products;
};

export const saveProducts = (products: IProduct[]) => {
  writeFileSync(dbPath, JSON.stringify(products, null, 2));
};

export const createProduct = (payload: IProduct) => {
  const products = readProduct();
  products.push(payload);
  saveProducts(products);
};

export const deleteProduct = (id: number) => {
  const products = readProduct();
  const filteredProducts = products.filter((p: IProduct) => p.id !== id);
  saveProducts(filteredProducts);
};
