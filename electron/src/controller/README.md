# File Based Controller Design

All exported functions are automatically added as event handlers exposed to the presentation layer via `controllerAPI.invoke({eventName, payload})`.

You have been warned. Do not export functions from files in this directory unless you wish for them to be accessible to the frontend via `invoke({eventName, payload})`.
