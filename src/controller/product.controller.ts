import { IncomingMessage, ServerResponse } from "http";
import { readProduct } from "../service/product.service.js";

export const productController = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    if (method === 'GET') {

        const products = readProduct();

        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'All products', data: products }))
    }


}