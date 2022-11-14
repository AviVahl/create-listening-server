# create-listening-server

[![npm version](https://badge.fury.io/js/create-listening-server.svg)](https://www.npmjs.com/package/create-listening-server)
[![Build Status](https://github.com/AviVahl/create-listening-server/workflows/tests/badge.svg)](https://github.com/AviVahl/create-listening-server/actions)

Promise-based API to create listening `http.Server` instances.

Safe creation functionality is also exposed, with automated consecutive port retries
when "address in use" errors occur. Useful for tests and development mode.

## Getting started

Install the library in an existing project:

```
npm i create-listening-server
```

## Example usage

Creation of an `http.Server` with a specific port:

```ts
import { createListeningHttpServer } from "create-listening-server";
import express from "express";

const PORT = 3000;

async function main() {
  const app = express();
  app.use(/* middleware */);

  const httpServer = await createListeningHttpServer(PORT, app);
}
```

Creation of an `http.Server` with automated consecutive ports retries:

```ts
import { safeListeningHttpServer } from "create-listening-server";
import express from "express";

const PREFERRED_PORT = 3000;

async function main() {
  const app = express();
  app.use(/* middleware */);

  const { httpServer, port } = await safeListeningHttpServer(PREFERRED_PORT, app);
}
```

## License

MIT
