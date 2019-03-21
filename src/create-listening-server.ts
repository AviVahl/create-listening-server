import { Server, IncomingMessage, ServerResponse, createServer } from 'http';

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
    return new Promise<Server>((resolve, reject) => {
        const httpServer = createServer(requestListener);
        httpServer.listen(port);
        httpServer.once('listening', () => {
            httpServer.removeListener('error', reject);
            resolve(httpServer);
        });
        httpServer.once('error', reject);
    });
}
