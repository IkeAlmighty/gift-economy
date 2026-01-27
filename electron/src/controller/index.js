class BaseController {
  handleEvent(eventName, payload) {
    if (this.handlers[eventName]) {
      for (const handler of this.handlers[eventName]) {
        return handler(payload);
      }
    }
  }
  registerHandlers(handlers) {
    // map events to handlers, using the function's name to identify the event

    this.handlers = {};
    for (const handler of handlers) {
      if (!this.handlers[handler.name]) {
        this.handlers[handler.name] = [];
      }

      this.handlers[handler.name].push(handler);
    }
  }
}

// Dynamically import all .js files in this directory except index.js
const controllerDir = __dirname;
const files = fs.readdirSync(controllerDir).filter((f) => f.endsWith(".js") && f !== "index.js");

for (const file of files) {
  const modulePath = path.join(controllerDir, file);
  const mod = require(modulePath);
  // Register all exported functions
  baseController.registerHandlers(Object.values(mod).filter((fn) => typeof fn === "function"));
}

export const baseController = new BaseController();
export default baseController;
