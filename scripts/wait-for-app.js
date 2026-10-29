// Waits until the E2E server and client answer, so Cypress never starts
// against an app that is still booting. Fails after TIMEOUT_MS.
const URLS = ['http://localhost:3001/api/health', 'http://127.0.0.1:3000'];
const TIMEOUT_MS = 60000;
const RETRY_MS = 500;

const isUp = (url) => fetch(url).then((res) => res.ok, () => false);

async function waitForApp() {
  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const results = await Promise.all(URLS.map(isUp));
    if (results.every(Boolean)) {
      console.log('App ready:', URLS.join(', '));
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, RETRY_MS));
  }
  console.error(`App not ready after ${TIMEOUT_MS / 1000}s:`, URLS.join(', '));
  process.exit(1);
}

waitForApp();
