import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class DependencyInjector {
  constructor() {
    this.trackedFunctions = {};
  }

  async mapDependencies(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (file.endsWith(".mjs")) {
        const modulePath = path.join(dir, file);
        try {
          const module = await import(`file://${modulePath}`);
          if (module.default) {
            if (!module.default.name) {
              console.warn(
                `Warning: Default function in file ${file} does not have a 'name' property, and so will be skipped in dependencies.`
              );
            } else {
              this.trackedFunctions[module.default.name] = module.default;
            }
          }
        } catch (error) {
          console.error(`Error loading dependency from file ${file}:`, error);
        }
      } else if (fs.lstatSync(path.join(dir, file)).isDirectory()) {
        await this.mapDependencies(path.join(dir, file));
      }
    }
  }

  // actually injects proxies for dependencies into the function's 'dependencies' property
  injectDependencies(func, visited = new Set()) {
    // prevent circular dependencies
    if (visited.has(func.name)) {
      throw new Error(`Circular dependency detected: ${[...visited, func.name].join(" -> ")}`);
    }
    visited.add(func.name);

    // first, identify that the function is being tracked:
    const trackedFunc = this.trackedFunctions[func.name];
    if (!trackedFunc) {
      throw new Error(`Function ${func.name} is not tracked for dependency injection.`);
    }

    const dependencies = {};
    func.dependencies = new Proxy(dependencies, {
      get: (_, prop) => {
        const dependencyFunc = this.trackedFunctions[prop];
        if (!dependencyFunc) {
          throw new Error(`Dependency ${prop} for function ${func.name} is not tracked.`);
        }

        // recursively inject dependencies for the dependency function
        this.injectDependencies(dependencyFunc, visited);
        return dependencyFunc;
      },
    });

    // done injecting for this function's dependency tree, remove from visited set
    visited.delete(func.name);
  }
}
