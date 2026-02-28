import { DependencyInjector } from "esm-di";
// import megaGlob from "../megaGlob.mjs";

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

    const modules = import.meta.glob("./**/*.mjs", { eager: true });
    controller.dependencyInjector = DependencyInjector.init(modules); // TODO init modules from megaglob

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

  async registerDefaultHandlers(dirPath) {
    // Dynamically import all .js files in this directory except index.js
    const paths = Object.keys(megaGlob).filter(
      (path) => path.includes(`/${dirPath}/`) && !path.endsWith("index.mjs")
    );

    for (const path in paths) {
      const mod = megaGlob[path];

      // Register all exported functions as handlers
      const handlers = Object.values(mod).filter((fn) => typeof fn === "function");
      this.registerHandlers(handlers);
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
