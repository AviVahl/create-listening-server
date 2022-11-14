import { Server, IncomingMessage, ServerResponse, createServer } from "node:http";
import { once } from "node:events";

/**
 * Creates a listening `http.Server` instance using a specific `port`.
 * Resolves when the server is listening, or rejects if an error occurs.
 *
 * @param port the port to try listening to
 * @param requestListener optional request listener. can also be added later with `httpServer.on('request', cb)`
 */
export async function createListeningHttpServer(
  port: number,
  requestListener?: (request: IncomingMessage, response: ServerResponse) => void
): Promise<Server> {
  const httpServer = createServer(requestListener);
  httpServer.listen(port);
  await once(httpServer, "listening");
  return httpServer;
}
