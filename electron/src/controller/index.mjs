import path from "node:path";
import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { DependencyInjector } from "../dependency-injection.mjs";

const CONSTRUCT_TOKEN = Symbol("construct");

// BaseController class definition
export class BaseController {
  constructor(contructToken = "") {
    if (contructToken !== CONSTRUCT_TOKEN) {
      throw new Error(
        "BaseController cannot be instantiated directly. Use BaseController.initialize()"
      );
    }
  }

  static async initialize({
    controllersDirectories = undefined,
    usecasesDirectories = undefined,
  } = {}) {
    const controller = new BaseController(CONSTRUCT_TOKEN);
    controller.handlers = {};
    controller.dependencyInjector = new DependencyInjector();

    // allow undefined controllerDirectories to mean "no directories to load"
    if (controllersDirectories) {
      for (const dir of controllersDirectories) {
        await controller.registerHandlersByDirectory(dir);
      }
    }

    // allow undefined usecasesDirectories to mean "no directories to map"
    if (usecasesDirectories) {
      for (const dir of usecasesDirectories) {
        await controller.dependencyInjector.mapDependencies(dir);
      }
    }

    return controller;
  }

  async registerHandlersByDirectory(dirPath) {
    // Dynamically import all .js files in this directory except index.js
    const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".mjs") && f !== "index.mjs");
    for (const file of files) {
      const modulePath = path.join(dirPath, file);
      const mod = await import(pathToFileURL(modulePath).href);

      // Register all exported functions as handlers
      this.registerHandlers(Object.values(mod).filter((fn) => typeof fn === "function"));
    }
  }

  async handleEvent(eventName, payload) {
    if (!this.handlers[eventName]) throw new Error(`No handler registered for event: ${eventName}`);

    // create a proxy for dependencies, allowing lazy injection.
    const dependencies = new Proxy(
      {},
      {
        get: (_, name) => {
          const depFunc = this.dependencyInjector.trackedFunctions[name];
          if (depFunc) {
            this.dependencyInjector.injectDependencies(depFunc);
            return depFunc;
          }
          throw new Error(`Dependency ${name} not found for event ${eventName}`);
        },
      }
    );

    // inject dependencies into the handler
    this.handlers[eventName].dependencies = dependencies;

    // handle the event:
    return await this.handlers[eventName](payload, dependencies);
  }

  registerHandlers(handlers) {
    // map events to handlers, using the function's name to identify the event
    for (const handler of handlers) {
      this.handlers[handler.name] = handler;
    }
  }
}
