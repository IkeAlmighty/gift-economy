// Node.js built-in test for baseController
import assert from "node:assert/strict";
import { test } from "node:test";
import { initBaseController } from "../../src/controller/index.js";

test("registers handlers and routes events", async () => {
  const baseController = await initBaseController();
  let called = false;
  const mockHandler = (payload) => {
    called = true;
    assert.deepEqual(payload, { testPayload: 123 });
    return `handled: ${payload.testPayload}`;
  };

  baseController.registerHandlers([mockHandler]);
  const result = baseController.handleEvent("mockHandler", { testPayload: 123 });
  assert.ok(called, "Handler should be called");
  assert.equal(result, "handled: 123");
});

test("throws error if no handler for event", async () => {
  const baseController = await initBaseController();

  assert.throws(() => {
    baseController.handleEvent("nonexistent", "payload");
  }, /No handler registered for event: nonexistent/);
});
