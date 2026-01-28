import path from "node:path";
import fs from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function requireControllers(dirPath) {
  // Dynamically import all .js files in this directory except index.js
  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".js") && f !== "index.js");
  for (const file of files) {
    const modulePath = path.join(dirPath, file);
    const mod = await import(pathToFileURL(modulePath).href);

    // Register all exported functions
    BaseController._instance.registerHandlers(
      Object.values(mod).filter((fn) => typeof fn === "function")
    );
  }
}

// BaseController class definition
class BaseController {
  static _instance = null;

  constructor() {
    this.handlers = {};
  }

  static async initBaseController() {
    if (!BaseController._instance) {
      BaseController._instance = new BaseController();
    }

    const controllersDir = path.join(__dirname);
    await requireControllers(controllersDir);

    return BaseController._instance;
  }

  static getInstance() {
    if (!BaseController._instance) {
      throw new Error("BaseController not initialized. Call initBaseController first.");
    }

    return BaseController._instance;
  }

  handleEvent(eventName, payload) {
    if (!this.handlers[eventName]) throw new Error(`No handler registered for event: ${eventName}`);
    return this.handlers[eventName](payload);
  }

  registerHandlers(handlers) {
    // map events to handlers, using the function's name to identify the event

    for (const handler of handlers) {
      this.handlers[handler.name] = handler;
    }
  }
}

export const initBaseController = BaseController.initBaseController;
export const getBaseControllerInstance = BaseController.getInstance;
