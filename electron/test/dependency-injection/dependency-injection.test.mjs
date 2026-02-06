import assert from "node:assert";
import { test } from "node:test";
import { DependencyInjector } from "../../src/dependency-injection.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("maps dependencies from directory", async () => {
  const injector = new DependencyInjector();
  await injector.mapDependencies(path.join(__dirname, "./mock-dependencies"));
  const dependencies = injector.trackedFunctions;

  assert.ok(dependencies["MockService"], "MockService should be tracked.");
});

// test("retrieves mapped dependency", async () => {});
