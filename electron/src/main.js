import { app, BrowserWindow, ipcMain } from "electron";
import path from "node:path";
import started from "electron-squirrel-startup";
import { BaseController } from "./base-controller.mjs";
import ConnectToHttpRelaysService from "./infrastructure/services/relays/ConnectToHttpRelays.mjs";
import ConnectToWebSocketRelaysService from "./infrastructure/services/relays/ConnectWebSocketRelays.mjs";
import defaultConfig from "./defaultConfig.mjs";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const config = { ...defaultConfig };

const isDev = !app.isPackaged;

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
      preload: path.join(__dirname, "preload.cjs"),
    },
  });

  // and load the index.html of the app.
  if (isDev) {
    const loadWithRetry = async () => {
      try {
        await mainWindow.loadURL("http://localhost:5173");
        console.log("Connected to Vite!");
      } catch (e) {
        console.log(`Connection failed: ${e.code} - ${e.description}`);
        console.log("Vite not ready, retrying in 500ms...");
        setTimeout(loadWithRetry, 500);
      }
    };
    loadWithRetry();
  } else {
    mainWindow.loadFile(path.join(__dirname, "index.html"));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // await new ConnectToHttpRelaysService(config.relayAddresses); // Start relay connections on app ready
  // await new ConnectToWebSocketRelaysService(config.relayAddresses); // Start websocket relay connections on app ready

  let controller = await BaseController.initialize({
    controllersDirs: [path.join(__dirname, "controller")],
    usecasesDirs: [path.join(__dirname, "application", "use-cases")],
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

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
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
