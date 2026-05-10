import { IncomingMessage, ServerResponse } from "http";
import { createProduct, readProduct, saveProducts } from "../service/product.service.js";
import type { IProduct } from "../types/product.type.js";
import { parseBody } from "../utility/parseBody.js";
import { sendResponse } from "../utility/sendResponse.js";

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
        return sendResponse(res, 404, false, "Product not found", []);
      }

      return sendResponse(res, 200, true, "Product details", product);
    }

    return sendResponse(res, 200, true, "All products", products);
  } else if (method === "POST" && url === "/products") {
    const body = await parseBody(req);
    const newProduct: IProduct = {
      id: Date.now(),
      ...body,
    };
    createProduct(newProduct);
    return sendResponse(res, 201, true, "Product created successfully", newProduct);
  } else if (method === "PUT" && url?.startsWith("/products")) {
    const body = await parseBody(req);
    const products = readProduct();

    if (id === null || isNaN(id)) {
      return sendResponse(res, 400, false, "Invalid product ID", null);
    }

    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      return sendResponse(res, 404, false, "Product not found", null);
    }

    products[index] = { ...products[index], ...body, id: products[index]!.id };
    saveProducts(products);

    return sendResponse(res, 200, true, "Product updated successfully", products[index]);
  } else if (method === "DELETE" && url?.startsWith("/products")) {
    const products = readProduct();

    if (id === null || isNaN(id)) {
      return sendResponse(res, 400, false, "Invalid product ID", null);
    }

    const index = products.findIndex((p: IProduct) => p.id === id);
    if (index < 0) {
      return sendResponse(res, 404, false, "Product not found", null);
    }

    products.splice(index, 1);
    saveProducts(products);

    return sendResponse(res, 200, true, "Product deleted successfully", null);
  }
};
