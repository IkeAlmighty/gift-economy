import { DependencyInjector, getModules } from "esm-di";

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

  static async initialize({ controllersDirs = undefined, usecasesDirs = undefined } = {}) {
    const controller = new BaseController(CONSTRUCT_TOKEN);
    controller.handlers = {};

    let usecaseModules = [];
    for (const dir of usecasesDirs) {
      usecaseModules = [...usecaseModules, ...(await getModules(dir))];
    }

    controller.dependencyInjector = await DependencyInjector.init(usecaseModules);
    console.log("injected: ", controller.dependencyInjector.trackedFunctions);

    let controllerModules = [];
    for (const dir of controllersDirs) {
      controllerModules = [...controllerModules, ...(await getModules(dir))];
    }

    controller.registerDefaultHandlers(controllerModules);

    return controller;
  }

  async registerDefaultHandlers(modules) {
    for (const module of modules) {
      const handlers = Object.values(module).filter((fn) => typeof fn === "function");
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
