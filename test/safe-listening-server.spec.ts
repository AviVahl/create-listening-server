import { Server } from 'http';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { safeListeningHttpServer, createListeningHttpServer } from '../src';

chai.use(chaiAsPromised);
const TEST_PORT = 3000;

describe('safeListeningHttpServer', () => {
    const runningServers: Server[] = [];

    afterEach('post-test server cleanup', async () => {
        for (const server of runningServers) {
            await new Promise(res => server.close(res));
        }
        runningServers.length = 0;
    });

    it('returns a listening http.Server instance', async () => {
        const { httpServer, port } = await safeListeningHttpServer(TEST_PORT);
        runningServers.push(httpServer);

        expect(httpServer).to.be.instanceOf(Server);
        expect(port).to.equal(TEST_PORT);
        expect(httpServer.listening).to.equal(true);
    });

    it('tries next consecutive port if port is already used', async () => {
        // create an existing server on TEST_PORT
        runningServers.push(await createListeningHttpServer(TEST_PORT));

        const { httpServer, port } = await safeListeningHttpServer(TEST_PORT);
        runningServers.push(httpServer);

        expect(httpServer).to.be.instanceOf(Server);
        expect(port).to.equal(TEST_PORT + 1);
        expect(httpServer.listening).to.equal(true);
    });

    it('fails if out of retries', async () => {
        // create 3 existing servers
        runningServers.push(
            await createListeningHttpServer(TEST_PORT),
            await createListeningHttpServer(TEST_PORT + 1),
            await createListeningHttpServer(TEST_PORT + 2)
        );
        const usedPortRetries = 2;

        const serverPromise = safeListeningHttpServer(TEST_PORT, undefined /* requestListener */, usedPortRetries)
            .then(({ httpServer }) => runningServers.push(httpServer)); // in case it doesn't fail, register for cleanup

        await expect(serverPromise).to.be.rejectedWith(
            `HTTP server could not start a listening on ports ${TEST_PORT}-${TEST_PORT + 2}`
        );
    });
});
