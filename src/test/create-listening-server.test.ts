import { describe, it, afterEach } from "node:test";
import { equal, ok, rejects } from "node:assert/strict";
import { Server } from "node:http";
import { once } from "node:events";
import { createListeningHttpServer } from "../create-listening-server.js";

const TEST_PORT = 3000;

describe("createListeningHttpServer", { concurrency: 1 }, () => {
  const runningServers: Server[] = [];

  afterEach(async () => {
    for (const server of runningServers) {
      server.close();
      await once(server, "close");
    }
    runningServers.length = 0;
  });

  it("returns a listening http.Server instance", async () => {
    const httpServer = await createListeningHttpServer(TEST_PORT);
    runningServers.push(httpServer);

    ok(httpServer instanceof Server);
    equal((httpServer.address() as import("net").AddressInfo).port, TEST_PORT);
    ok(httpServer.listening);
  });

  it("exposes listenning errors as creation rejections", async () => {
    // create an existing server on port
    runningServers.push(await createListeningHttpServer(TEST_PORT));

    const serverPromise = createListeningHttpServer(TEST_PORT).then((server) => runningServers.push(server)); // in case it doesn't fail, register for cleanup

    await rejects(serverPromise, "EADDRINUSE");
  });
});
