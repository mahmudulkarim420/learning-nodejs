import { IncomingMessage, ServerResponse } from "http";
import { createProduct, readProduct } from "../service/product.service.js";
import type { IProduct } from "../types/product.type.js";
import { parseBody } from "../utility/parseBody.js";

export const productController = async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    if (method === 'GET') {
        const urlParts = url?.split('/')
        const id = urlParts && urlParts[1] === "products" && urlParts[2] ? Number(urlParts[2]) : null;

        const products = readProduct();

        if (id !== null && !isNaN(id)) {
            const product = products.find((p: IProduct) => p.id === id);

            if (!product) {
                res.writeHead(404, { 'content-type': 'application/json' })
                return res.end(JSON.stringify({ message: 'Product not found', data: [] }))
            }

            res.writeHead(200, { 'content-type': 'application/json' })
            return res.end(JSON.stringify({ message: 'Product details', data: product }))
        }

        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'All products', data: products }))
    } else if (method === 'POST' && url === '/products') {
        const body = await parseBody(req);
        const products = readProduct();
        const newProduct: IProduct = {
            id: Date.now(),
            ...body
        }
        products.push(newProduct);
        createProduct(products)
        res.writeHead(201, { 'content-type': 'application/json' });
        return res.end(JSON.stringify({ message: 'Product created successfully', data: newProduct }));
    }
}