import { app, BrowserWindow } from "electron";
import path from "path";
import { initDatabase } from "./backend/db/db";
import "./backend/ipcHandlers/patients";
import "./backend/ipcHandlers/ip";

const isDev = process.env.NODE_ENV === "development" || process.env.VITE_DEV_SERVER === "true";
console.log("is dev mode:",isDev)
let mainWindow: BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) mainWindow.loadURL("http://localhost:5173/");
  else mainWindow.loadFile(path.join(__dirname, "../build-render/index.html"));
}

app.whenReady().then(() => {
  initDatabase();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


