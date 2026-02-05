import assert from "node:assert/strict";
import { test } from "node:test";
import { BaseController } from "../../src/controller/index.mjs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("BaseController initializes and registers a single handler correctly.", async () => {
  const controller = await BaseController.initialize();
  const mockHandler = (payload) => `handled: ${payload.testPayload}`;
  controller.registerHandlers([mockHandler]);
  assert.ok(controller.handlers["mockHandler"], "Handler for 'mockHandler' should be registered.");
});

test("BaseController handles an event and returns expected result.", async () => {
  const controller = await BaseController.initialize();
  const mockHandler = (payload) => `handled: ${payload.testPayload}`;
  controller.registerHandlers([mockHandler]);
  const result = await controller.handleEvent("mockHandler", { testPayload: "data" });
  assert.equal(result, "handled: data", "Handler should return expected result.");
});

test("BaseController throws error for unregistered event.", async () => {
  const controller = await BaseController.initialize();
  try {
    await controller.handleEvent("nonExistentHandler", {});
    assert.fail("Expected error was not thrown.");
  } catch (error) {
    assert.equal(
      error.message,
      "No handler registered for event: nonExistentHandler",
      "Error message should match expected."
    );
  }
});

test("BaseController injects dependencies into handler correctly.", async () => {
  const controller = await BaseController.initialize({
    controllersDirectories: [path.join(__dirname, "mock-handlers")],
    usecasesDirectories: [path.join(__dirname, "../dependency-injection/mock-dependencies")],
  });

  const result = await controller.handleEvent("handleWithDependencies", { testPayload: "data" });
  assert.equal(result, "handled: data", "Handler should return expected result.");
});
