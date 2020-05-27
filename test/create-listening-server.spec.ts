import { Server } from 'http';
import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import { createListeningHttpServer } from '../src';

chai.use(chaiAsPromised);
const TEST_PORT = 3000;

describe('createListeningHttpServer', () => {
  const runningServers: Server[] = [];

  afterEach('post-test server cleanup', async () => {
    for (const server of runningServers) {
      await new Promise((res) => server.close(res));
    }
    runningServers.length = 0;
  });

  it('returns a listening http.Server instance', async () => {
    const httpServer = await createListeningHttpServer(TEST_PORT);
    runningServers.push(httpServer);

    expect(httpServer).to.be.instanceOf(Server);
    expect((httpServer.address() as import('net').AddressInfo).port).to.equal(TEST_PORT);
    expect(httpServer.listening).to.equal(true);
  });

  it('exposes listenning errors as creation rejections', async () => {
    // create an existing server on port
    runningServers.push(await createListeningHttpServer(TEST_PORT));

    const serverPromise = createListeningHttpServer(TEST_PORT).then((server) => runningServers.push(server)); // in case it doesn't fail, register for cleanup

    await expect(serverPromise).to.be.rejectedWith('EADDRINUSE');
  });
});
