import type { Server, IncomingMessage, ServerResponse } from "node:http";
import { createListeningHttpServer } from "./create-listening-server.js";

/**
 * Safe creation of a listening `http.Server` instance. Tries using `preferredPort`,
 * and if already in use, it re-tries using consecutive ports.
 *
 * @param preferredPort the initial port to try listening to
 * @param requestListener optional request listener. can also be added later with `httpServer.on('request', cb)`
 * @param usedPortRetries number of consecutive ports to retry. @default 100
 * @param hostname optional host to pass to .listen()
 *
 * @returns the http server with the actual port it ended up picking
 */
export async function safeListeningHttpServer(
  preferredPort: number,
  requestListener?: (request: IncomingMessage, response: ServerResponse) => void,
  usedPortRetries = 100,
  hostname?: string
): Promise<{ httpServer: Server; port: number }> {
  const lastPort = preferredPort + usedPortRetries;

  let port = preferredPort;
  do {
    try {
      const httpServer = await createListeningHttpServer(port, requestListener, hostname);
      const address = httpServer.address();
      const actualPort = typeof address === "object" && address !== null ? address.port : port;
      return { httpServer, port: actualPort };
    } catch (e) {
      if (!isUsedPortError(e)) {
        throw e;
      }
    }
  } while (++port <= lastPort);

  throw new Error(`HTTP server could not start a listening on ports ${preferredPort}-${lastPort}`);
}

const isUsedPortError = (e: unknown): e is Error => !!e && (e as { code: string }).code === "EADDRINUSE";
