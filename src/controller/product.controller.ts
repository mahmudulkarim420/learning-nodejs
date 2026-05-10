import { IncomingMessage, ServerResponse } from "http";
import { createProduct, readProduct, saveProducts } from "../service/product.service.js";
import type { IProduct } from "../types/product.type.js";
import { parseBody } from "../utility/parseBody.js";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
  const url = req.url;
  const method = req.method;

  const urlParts = url?.split("/");
  const id = urlParts && urlParts[1] === "products" && urlParts[2] ? Number(urlParts[2]) : null;

  if (method === "GET") {
    const products = readProduct();

    if (id !== null && !isNaN(id)) {
      const product = products.find((p: IProduct) => p.id === id);

      if (!product) {
        res.writeHead(404, { "content-type": "application/json" });
        return res.end(JSON.stringify({ message: "Product not found", data: [] }));
      }

      res.writeHead(200, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Product details", data: product }));
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "All products", data: products }));
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    const newProduct: IProduct = {
      id: Date.now(),
      ...body,
    };
    createProduct(newProduct);
    res.writeHead(201, { "content-type": "application/json" });
    return res.end(JSON.stringify({ message: "Product created successfully", data: newProduct }));
  } else if (method === "PUT" && url?.startsWith("/products")) {
    const body = await parseBody(req);
    const products = readProduct();

    if (id === null || isNaN(id)) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Invalid product ID", data: null }));
    }

    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Product not found!", data: null }));
    }

    products[index] = { ...products[index], ...body, id: products[index]!.id };
    saveProducts(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Product updated successfully!", data: products[index] }));
  } else if (method === "DELETE" && url?.startsWith("/products")) {
    const products = readProduct();

    if (id === null || isNaN(id)) {
      res.writeHead(400, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Invalid product ID", data: null }));
    }

    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      res.writeHead(404, { "content-type": "application/json" });
      return res.end(JSON.stringify({ message: "Product not found!", data: null }));
    }

    products.splice(index, 1);
    saveProducts(products);

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "Product deleted successfully!", data: null }));
  }
};
