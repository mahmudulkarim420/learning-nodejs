import { createServer, IncomingMessage, Server, ServerResponse } from "http";
import { routeHandler } from "./routes/route.js";
import config from "./config/index.js";

const server: Server = createServer((req: IncomingMessage, res : ServerResponse) => {

    routeHandler(req, res);

})

server.listen(config.PORT, () => {
    console.log(`Server is running on the port ${config.PORT}`)
})