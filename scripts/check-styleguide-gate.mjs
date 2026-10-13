// Asserts that /styleguide returns 404 in a production build (spec 0002, AC-11).
// Run after `VERCEL_ENV=production pnpm build`: starts the built app, requests
// the page, and exits non zero unless the response is a 404.
import { spawn } from "node:child_process";

const port = process.env.PORT ?? "3200";
const url = `http://localhost:${port}/styleguide`;
const server = spawn("node_modules/.bin/next", ["start", "-p", port], { stdio: "inherit" });

const waitForStatus = async (deadline) => {
  try {
    return (await fetch(url, { redirect: "manual" })).status;
  } catch {
    if (Date.now() > deadline) throw new Error(`Server did not start on port ${port}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return waitForStatus(deadline);
  }
};

try {
  const status = await waitForStatus(Date.now() + 60_000);
  if (status !== 404) {
    console.error(`Expected GET /styleguide to return 404 in production, got ${status}.`);
    process.exitCode = 1;
  } else {
    console.log("GET /styleguide returned 404 in the production build.");
  }
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  server.kill();
}
