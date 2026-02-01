import assert from "node:assert/strict";
import { test } from "node:test";
import { initBaseController } from "../../src/controller/index.mjs";

test("listings controller is autoregisters in the baseController", async () => {
  const baseController = await initBaseController();

  const createListingHandlerExists = baseController.handlers["createListing"] !== undefined;
  assert.ok(
    createListingHandlerExists,
    "createListing handler should be registered in baseController"
  );
});
