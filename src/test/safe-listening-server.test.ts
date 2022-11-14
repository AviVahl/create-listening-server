import { describe, it, afterEach } from "node:test";
import { equal, ok, rejects } from "node:assert/strict";
import { Server } from "node:http";
import { once } from "node:events";
import { safeListeningHttpServer } from "../safe-listening-server.js";
import { createListeningHttpServer } from "../create-listening-server.js";

const TEST_PORT = 8080;

describe("safeListeningHttpServer", { concurrency: 1 }, () => {
  const runningServers: Server[] = [];

  afterEach(async () => {
    for (const server of runningServers) {
      server.close();
      await once(server, "close");
    }
    runningServers.length = 0;
  });

  it("returns a listening http.Server instance", async () => {
    const { httpServer, port } = await safeListeningHttpServer(TEST_PORT);
    runningServers.push(httpServer);

    ok(httpServer instanceof Server);
    equal(port, TEST_PORT);
    ok(httpServer.listening);
  });

  it("tries next consecutive port if port is already used", async () => {
    // create an existing server on TEST_PORT
    runningServers.push(await createListeningHttpServer(TEST_PORT));

    const { httpServer, port } = await safeListeningHttpServer(TEST_PORT);
    runningServers.push(httpServer);

    ok(httpServer instanceof Server);
    equal(port, TEST_PORT + 1);
    ok(httpServer.listening);
  });

  it("fails if out of retries", async () => {
    // create 3 existing servers
    runningServers.push(
      await createListeningHttpServer(TEST_PORT),
      await createListeningHttpServer(TEST_PORT + 1),
      await createListeningHttpServer(TEST_PORT + 2)
    );
    const usedPortRetries = 2;

    const serverPromise = safeListeningHttpServer(TEST_PORT, undefined /* requestListener */, usedPortRetries).then(
      ({ httpServer }) => runningServers.push(httpServer)
    ); // in case it doesn't fail, register for cleanup

    await rejects(serverPromise, {
      message: `HTTP server could not start a listening on ports ${TEST_PORT}-${TEST_PORT + 2}`,
    });
  });
});
