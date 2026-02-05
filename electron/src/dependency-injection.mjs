import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class DependencyInjector {
  constructor() {
    this.dependenciesMap = {};
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
              this.dependenciesMap[module.default.name] = {
                func: module.default,
                dependencyNames: module.Dependencies || module.dependencies || [],
              };
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

  getDependencies() {
    return this.dependenciesMap;
  }

  injectDependencies(func, visited = new Set()) {
    // prevent circular dependencies
    if (visited.has(func.name)) {
      throw new Error(`Circular dependency detected: ${[...visited, func.name].join(" -> ")}`);
    }
    visited.add(func.name);

    // injects the dependencies into the function based on its name
    // grab the names of the dependencies
    const dependencyNames = this.dependenciesMap[func.name]?.dependencyNames || [];
    func.dependencies = {};
    // for each dependency name, get the dependency function and inject it to this function
    dependencyNames.forEach((depName) => {
      const depFunc = this.dependenciesMap[depName]?.func;
      func.dependencies[depName] = depFunc;

      // if the dependency has its own dependencies, inject those as well
      if (this.dependenciesMap[depName]?.dependencyNames.length > 0) {
        this.injectDependencies(func.dependencies[depName], visited);
      }
    });

    // done injecting for this function's dependency tree, remove from visited set
    visited.delete(func.name);
  }
}
