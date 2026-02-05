import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import BaseController from "./controller";
import ConnectToHttpRelaysService from "./infrastructure/services/relays/ConnectToHttpRelays.mjs";
import ConnectToWebSocketRelaysService from "./infrastructure/services/relays/ConnectWebSocketRelays.mjs";

import defaultConfig from "./defaultConfig.mjs";

let controller;
const config = { ...defaultConfig };

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });

  await new ConnectToHttpRelaysService(config.relayAddresses).execute(); // Start relay connections on app ready
  await new ConnectToWebSocketRelaysService(config.relayAddresses).execute(); // Start websocket relay connections on app ready
  controller = await BaseController.initialize({
    controllersDirectories: [path.join(__dirname, "controller")],
    usecasesDirectories: [path.join(__dirname, "")],
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Listen for events sent from the renderer via the context bridge
ipcMain.handle("controller-event", async (_, { eventName, payload }) => {
  try {
    return await controller.handleEvent(eventName, payload);
  } catch (error) {
    console.error(`Error handling event ${eventName}:`, error);
    throw error; // Propagate error back to renderer
  }
});
