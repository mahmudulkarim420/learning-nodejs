import { IncomingMessage, ServerResponse } from "http";
import { productController } from "../controller/product.controller.js";

export const routeHandler = (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url;
    const method = req.method;

    if (url === '/' && method === 'GET') {
        res.writeHead(200, { 'content-type': 'application/json' })
        res.end(JSON.stringify({ message: 'Welcome to Node.js server' }))
    } else if (url?.startsWith('/products') && method === 'GET') {
       productController(req,res);
    } else {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end(JSON.stringify({ message: 'Not Found' }))
    }
}