// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// Expose a secure API to the renderer process
contextBridge.exposeInMainWorld("controllerAPI", {
  invoke: (eventName, payload) => {
    return ipcRenderer.invoke("controller-event", { eventName, payload });
  },
});
